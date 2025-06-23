import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server } from 'ws';
import { OrdersService } from '../orders/orders.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class WebsocketService implements OnModuleInit, OnModuleDestroy {
    private server: Server;
    private logger: Logger = new Logger('WebsocketService');

    constructor(private readonly ordersService: OrdersService) {}

    onModuleInit() {
        this.server = new Server({ port: 8080 }); // Можно настроить порт через env
        this.server.on('connection', (ws, req) => {
            this.logger.log(`Клиент подключён: ${req.socket.remoteAddress}`);
            const urlParams = new URLSearchParams(req.url?.split('?')[1]);
            const userId = urlParams.get('userId');

            if (userId) {
                ws['userId'] = userId; // Сохраняем userId в объекте соединения
            }

            ws.on('message', (message: string) => {
                this.logger.log(`Получено сообщение: ${message}`);
            });

            ws.on('close', () => {
                this.logger.log(`Клиент отключён: ${req.socket.remoteAddress}`);
            });
        });

        this.logger.log('WebSocket сервер запущен на порту 8080');
    }

    onModuleDestroy() {
        if (this.server) {
            this.server.close();
            this.logger.log('WebSocket сервер остановлен');
        }
    }

    async notifyOrderUpdate(orderId: number, userId: number) {
        try {
            const order = await this.ordersService.findOneOrder(orderId);
            if (order) {
                this.server.clients.forEach((client) => {
                    if (client['userId'] === userId.toString()) {
                        client.send(JSON.stringify(order));
                    }
                });
                this.logger.log(`Отправлено уведомление для user_${userId} о заказе ${orderId}`);
            }
        } catch (error) {
            this.logger.error(`Ошибка при отправке уведомления: ${error}`);
        }
    }
}