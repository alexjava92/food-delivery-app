import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// тип событий и payload
type Events = {
    "order-notification": { id: number; status: string; message: string };
};

export const useWebSocket = (userId: number | undefined) => {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const socket = io("https://pivko.pro", {
            path: "/ws",
            transports: ["websocket"],
            query: { userId },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("✅ WS connected");
            setConnected(true);
        });

        socket.on("disconnect", () => {
            console.warn("❌ WS disconnected");
            setConnected(false);
        });

        socket.on("connect_error", (err) => {
            console.error("⚠️ WS connect error:", err);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    // 🎯 типизированная подписка вручную
    const subscribe = <T extends keyof Events>(
        event: T,
        callback: (data: Events[T]) => void
    ) => {
        socketRef.current?.on(event as string, callback as (...args: any[]) => void);
    };

    const unsubscribe = (event: keyof Events) => {
        socketRef.current?.off(event as string);
    };

    return {
        socket: socketRef.current,
        connected,
        subscribe,
        unsubscribe,
    };
};
