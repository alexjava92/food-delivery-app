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
            const order = await this.ordersRepository.create({...dto});

            let arrProductId = [];
            for (const product of dto.orderProducts) {
                arrProductId.push(product.id);
            }

            await order.$set('orderProducts', arrProductId);
            for (const product of dto.orderProducts) {
                await OrderProductsModel.update(
                    {count: product.count},
                    {where: {products: product.id}},
                );
            }
            const adminId = await this.usersService.findAdmin()
            const newOrder = await this.ordersRepository.findOne({where: {id: order.id}, include: ProductsModel});

            await this.botService.notification(adminId, newOrder)
            return order;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при создании заказа: ${e}`)
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
        try {
            const order = await this.ordersRepository.findOne({where: {id}});
            await order.update({...dto});
            const user = await this.usersService.findOneId(order.userId)
            if (dto.status) {
                await this.botService.userNotification(user.chatId, `Номер заказа: ${id} - Изменен статус заказа на ${dto.status}`)
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
            let productsInOrders = []
            let stat = []
            let ordersCounts = []
            const startTime = new Date(query.startTime).toISOString()
            const endTime = new Date(query.endTime).toISOString()

            const orders = await this.ordersRepository.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startTime, endTime],
                    },
                },
                include: { all: true }
            });

            for (let products of orders) {
                productsInOrders.push(...products.orderProducts)
            }

            if (query.catId) {
                // Все товары нужной категории
                const filteredProducts = productsInOrders.filter(item => item.categoryId == query.catId);

                // Подсчёт количества проданных штук по каждому товару
                const productsCounts = filteredProducts.reduce((acc, product) => {
                    const productId = product.id;
                    acc[productId] = acc[productId] || { count: 0, title: product.title };
                    acc[productId].count += product.count;
                    return acc;
                }, {});

                stat = Object.entries(productsCounts).map(([_, value]: any) => ({
                    title: value.title,
                    count: value.count,
                }));

                // Общая выручка
                const gain = filteredProducts.reduce((sum, p) => sum + p.price * p.count, 0);

                // Кол-во заказов, где есть хотя бы один товар этой категории
                const ordersWithThisCategory = orders.filter(order =>
                    order.orderProducts.some(p => p.categoryId == query.catId)
                );

                const countOfOrders = ordersWithThisCategory.length;
                const averageCheck = countOfOrders ? (gain / countOfOrders).toFixed(2) : 0;

                return { gain, countOfOrders, averageCheck, stat };
            } else {
                ordersCounts = orders;

                const categoryCounts = productsInOrders.reduce((item, product) => {
                    const categoryId = product.categoryId;
                    item[categoryId] = item[categoryId] || { count: 0, products: [] };
                    item[categoryId].count += product.count;
                    item[categoryId].products.push(product);
                    return item;
                }, {});

                for (const categoryId in categoryCounts) {
                    const category = await this.categoriesRepository.findOne({ where: { id: categoryId } })
                    stat.push({
                        id: categoryId,
                        title: category.title,
                        count: categoryCounts[categoryId].count
                    });
                }

                const gain = productsInOrders.reduce((total, product) => total + product.price * product.count, 0);
                const countOfOrders = ordersCounts.length;
                const averageCheck = countOfOrders ? (gain / countOfOrders).toFixed(2) : 0;

                return { gain, countOfOrders, averageCheck, stat };
            }

        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении статистики: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении статистики: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

}
