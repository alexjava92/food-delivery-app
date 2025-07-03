import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

class SetMaintenanceDto {
    maintenance: boolean;
}

class SetDeliveryDto {
    deliveryPrice: number;
    freeDeliveryFrom: number;
}

@ApiTags('Settings')
@Controller('api/settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}

    @Get('maintenance')
    @ApiOperation({ summary: 'Получить состояние режима обслуживания' })
    @ApiResponse({ status: 200, description: 'Текущее значение maintenance-флага' })
    getMaintenance() {
        return this.settingsService.getMaintenance();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('maintenance')
    @ApiOperation({ summary: 'Установить состояние режима обслуживания (только для админов)' })
    @ApiResponse({ status: 200, description: 'Флаг успешно обновлён' })
    async setMaintenance(@Body() body: SetMaintenanceDto) {
        console.log('[PATCH] /api/settings/maintenance → body:', body);

        try {
            return await this.settingsService.setMaintenance(body.maintenance);
        } catch (error) {
            console.error('[PATCH] Ошибка обновления maintenance:', error);
            throw error;
        }
    }

    @Get('delivery')
    @ApiOperation({ summary: 'Получить настройки доставки' })
    @ApiResponse({ status: 200, description: 'deliveryPrice + freeDeliveryFrom' })
    getDeliverySettings() {
        return this.settingsService.getDeliverySettings();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('delivery')
    @ApiOperation({ summary: 'Обновить deliveryPrice и freeDeliveryFrom (только админ)' })
    @ApiResponse({ status: 200, description: 'Значения успешно обновлены' })
    setDeliverySettings(@Body() body: SetDeliveryDto) {
        return this.settingsService.setDeliverySettings(body);
    }
}
