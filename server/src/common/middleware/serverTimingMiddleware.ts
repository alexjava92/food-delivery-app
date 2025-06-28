import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ServerTimingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();

        // Сохраняем duration в переменную
        res.on('finish', () => {
            const duration = Date.now() - start;

            // ✅ Заголовок устанавливаем, только если ответ не отправлен
            if (!res.headersSent) {
                res.setHeader('Server-Timing', `total;dur=${duration}`);
            }
        });

        // 👇 ставим Server-Timing заранее, он всё равно попадёт в ответ
        res.setHeader('Server-Timing', 'processing');

        next();
    }
}
