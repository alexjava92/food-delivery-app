import { setUnreadCount } from "../store/slice/notificationSlice";
import { store } from "../store/store";
import WebSocket from 'ws';

class WebSocketService {
    private socket: WebSocket | null = null;

    connect(userId: number) {
        const wsUrl = `ws://pivko.pro:8080?userId=${userId}`; // Замени <твой-домен> на реальный адрес сервера
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log("WebSocket подключён к", wsUrl);
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data.toString());
            if (data.notifications || data.status) {
                const currentCount = store.getState().notificationReducer.unreadCount;
                store.dispatch(setUnreadCount(currentCount + 1));
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket отключён");
        };

        this.socket.onerror = (error) => {
            console.error("Ошибка WebSocket:", error);
        };
    }

    disconnect() {
        this.socket?.close();
    }
}

export const wsService = new WebSocketService();