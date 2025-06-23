import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('api/settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}


    @Get('maintenance')
    getMaintenance() {
        return this.settingsService.getMaintenance();
    }

    // PATCH оставляем защищённым
    @UseGuards(JwtAuthGuard)
    @Patch('maintenance')
    async setMaintenance(@Body() body: { maintenance: boolean }) {
        console.log('[PATCH] /api/settings/maintenance → body:', body);

        try {
            return await this.settingsService.setMaintenance(body.maintenance);
        } catch (error) {
            console.error('[PATCH] Ошибка обновления maintenance:', error);
            throw error;
        }
    }
}
