import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('api/settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('maintenance')
    getMaintenance() {
        return this.settingsService.getMaintenance();
    }

    @UseGuards(JwtAuthGuard)
    @Patch('maintenance')
    setMaintenance(@Body() body: { maintenance: boolean }) {
        return this.settingsService.setMaintenance(body.maintenance);
    }
}
