import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../../settings/settings.service';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
    constructor(private readonly settingsService: SettingsService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const maintenance = await this.settingsService.get('maintenance');

        const isAdminRoute = req.url.startsWith('/api/settings') || req.url.startsWith('/api/user');

        if (maintenance === 'true' && !isAdminRoute) {
            return res.status(503).json({
                message: 'Сервис временно недоступен из-за технических работ.',
                maintenance: true,
            });
        }

        next();
    }
}
