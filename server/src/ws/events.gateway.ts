import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients = new Map<number, Socket>();

    handleConnection(client: Socket) {
        const userId = +client.handshake.query.userId;
        if (userId) {
            this.clients.set(userId, client);
            console.log(`User ${userId} connected`);
        }
    }

    handleDisconnect(client: Socket) {
        for (const [userId, socket] of this.clients.entries()) {
            if (socket.id === client.id) {
                this.clients.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    }

    emitToUser(userId: number, event: string, payload: any) {
        const socket = this.clients.get(userId);
        if (socket) {
            socket.emit(event, payload);
        }
    }

    broadcast(event: string, payload: any) {
        this.server.emit(event, payload);
    }
}
