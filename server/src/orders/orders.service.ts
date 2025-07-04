import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {OrdersModel} from './orders.model';
import {InjectModel} from '@nestjs/sequelize';
import {ProductsModel} from 'src/products/products.model';
import {OrderProductsModel} from './ordersProducts.model';
import {BotService} from "../bot/bot.service";
import {UsersService} from "../users/users.service";
import {CategoriesModel} from "../categories/categories.model";
import {Op} from "sequelize";
import { EventsGateway } from '../ws/events.gateway'; // путь зависит от твоей структуры

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(OrdersModel)
        private ordersRepository: typeof OrdersModel,
        @InjectModel(CategoriesModel)
        private categoriesRepository: typeof CategoriesModel,
        private readonly botService: BotService,
        private readonly usersService: UsersService,
        private readonly eventsGateway: EventsGateway,
    ) {
    }

    async createOrder(dto: CreateOrderDto) {
        try {
            const order = await this.ordersRepository.create({ ...dto });

            for (const product of dto.orderProducts) {
                await order.$add('orderProducts', product.id, {
                    through: { count: product.count },
                });
            }

            const adminId = await this.usersService.findAdmin();
            const newOrder = await this.ordersRepository.findOne({
                where: { id: order.id },
                include: ProductsModel,
            });

            await this.botService.notification(adminId, newOrder);
            return order;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при создании заказа: ${e}`);
            throw new HttpException(
                `Произошла ошибка при создании заказа: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    async findAllOrder(page: string) {

        try {
            const count = 10
            return this.ordersRepository.findAndCountAll({
                order: [
                    ['id', 'DESC']
                ],
                include: {all: true},
                limit: parseInt(page) * count,
            })
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении заказов: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении заказов: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllOrdersUser(userId: number) {
        try {
            return this.ordersRepository.findAll({
                where: {userId},
                order: [
                    ['id', 'DESC']
                ],
                include: {all: true}
            });
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении заказов: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении заказов: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOneOrder(id: number) {
        try {
            const order = await this.ordersRepository.findOne({
                where: {id},
                include: ProductsModel,
            });
            for (const product of order.orderProducts) {
                product.count = await OrderProductsModel.findOne({
                    where: {products: product.id},
                    attributes: ['count'],
                }).then((op) => op?.count || product.count);
            }
            const data = {...order.dataValues}
            return data;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении заказа: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении заказа: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateOrder(id: number, dto: UpdateOrderDto) {

        const statusMessages = {
            "новый": (id: number) => `🛎 Заказ №${id}\n\nСтатус: 🟡 Принят в обработку\n\nМы получили ваш заказ и уже начали подготовку!`,
            "готовится": (id: number) => `👨‍🍳 Заказ №${id}\n\nСтатус: 🔵 Готовится\n\nНаши повара уже работают над вашим заказом!`,
            "готово к выдаче": (id: number) => `📢 Заказ №${id}\n\nСтатус: 🟠 Готово к выдаче\n\nМожно забирать! Мы ждём вас 🍽`,
            "выдано": (id: number) => `✅ Заказ №${id}\n\nСтатус: 🟢 Выдан\n\nСпасибо, что выбрали нас! Приятного аппетита 😋`,
            "отменен": (id: number) => `⚠️ Заказ №${id}\n\nСтатус: 🔴 Отменён\n\nЕсли это ошибка — свяжитесь с нами, мы поможем.`
        };


        try {
            const order = await this.ordersRepository.findOne({where: {id}});

            if (dto.status && dto.status === order.status) {
                // Статус не изменился — ничего не делаем
                return order;
            }

            await order.update({...dto});
            const user = await this.usersService.findOneId(order.userId)
            if (dto.status) {
                const message = statusMessages[dto.status]?.(id) || `Номер заказа: ${id} - Статус: ${dto.status}`;
                await this.botService.userNotification(user.chatId, message);
                this.eventsGateway.emitToUser(user.id, 'order-notification', {

                    id: order.id,
                    status: dto.status,
                    message: `Ваш заказ №${order.id} теперь "${dto.status}"`,

                });
                console.log("📤 Отправка WS клиенту:", user.id);

            }

            return order;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при изменении статуса заказа: ${e}`)
            throw new HttpException(
                `Произошла ошибка при изменении статуса заказа: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async statistics(query: any) {
        try {
            const startTime = new Date(query.startTime).toISOString();
            const endTime = new Date(query.endTime).toISOString();

            const orders = await this.ordersRepository.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startTime, endTime],
                    },
                },
                include: [
                    {
                        association: 'orderProducts',
                        through: {
                            attributes: ['count'],
                            as: 'order_product'
                        }
                    },
                ],
            });

            if (query.catId) {
                const statMap = new Map<number, { title: string; count: number }>();
                let gain = 0;
                const ordersWithThisCategory = new Set<number>();

                for (const order of orders) {
                    let hasCategory = false;

                    for (const product of order.orderProducts) {
                        if (product.categoryId != query.catId) continue;

                        const count = product.order_product?.count || 1;
                        const price = Number(product.price) || 0;
                        gain += price * count;

                        hasCategory = true;

                        const productId = Number(product.id);
                        const existing = statMap.get(productId);
                        if (existing) {
                            existing.count += count;
                        } else {
                            statMap.set(productId, { title: product.title, count });
                        }
                    }

                    if (hasCategory) {
                        ordersWithThisCategory.add(order.id);
                    }
                }

                const stat = Array.from(statMap.values());
                const countOfOrders = ordersWithThisCategory.size;
                const averageCheck = countOfOrders ? (gain / countOfOrders).toFixed(2) : 0;

                return { gain, countOfOrders, averageCheck, stat };
            } else {
                const categoryMap = new Map<number, { title: string; count: number }>();
                let gain = 0;

                for (const order of orders) {
                    for (const product of order.orderProducts) {
                        const categoryId = Number(product.categoryId);
                        const count = product.order_product?.count || 1;
                        const price = Number(product.price) || 0;

                        gain += price * count;

                        if (!categoryMap.has(categoryId)) {
                            const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
                            categoryMap.set(categoryId, {
                                title: category?.title || 'Неизвестно',
                                count,
                            });
                        } else {
                            const existing = categoryMap.get(categoryId)!;
                            existing.count += count;
                        }
                    }
                }

                const stat = Array.from(categoryMap.entries()).map(([id, value]) => ({
                    id: id.toString(),
                    title: value.title,
                    count: value.count,
                }));

                const countOfOrders = orders.length;
                const averageCheck = countOfOrders ? (gain / countOfOrders).toFixed(2) : 0;

                return { gain, countOfOrders, averageCheck, stat };
            }
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении статистики: ${e}`);
            throw new HttpException(
                `Произошла ошибка при получении статистики: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }






}
