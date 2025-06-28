import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ServerTimingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const timings = [];
        const start = Date.now();

        res.once('finish', () => {
            const duration = Date.now() - start;
            timings.push(`total;dur=${duration}`);
            res.setHeader('Server-Timing', timings.join(', '));
        });

        next();
    }
}
