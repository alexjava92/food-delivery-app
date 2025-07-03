import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SettingsModel } from './settings.model';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(SettingsModel) private settingsRepo: typeof SettingsModel,
    ) {}

    async get(key: string): Promise<string> {
        const setting = await this.settingsRepo.findByPk(key);
        return setting?.value || 'false';
    }

    async set(key: string, value: string): Promise<void> {
        const [setting] = await this.settingsRepo.findOrCreate({ where: { key } });
        await setting.update({ value });
    }

    async getMaintenance() {
        const value = await this.get('maintenance');
        return { maintenance: value === 'true' };
    }

    async setMaintenance(value: boolean) {
        const [setting] = await this.settingsRepo.findOrCreate({ where: { key: 'maintenance' } });
        await setting.update({ value: value.toString() });
        return { maintenance: value };
    }

    async getDeliverySettings() {
        const deliveryPrice = parseInt(await this.get('delivery_price') || '0');
        const freeFrom = parseInt(await this.get('free_delivery_from') || '0');
        return {
            deliveryPrice,
            freeDeliveryFrom: freeFrom,
        };
    }

    async setDeliverySettings(values: { deliveryPrice: number, freeDeliveryFrom: number }) {
        await this.set('delivery_price', values.deliveryPrice.toString());
        await this.set('free_delivery_from', values.freeDeliveryFrom.toString());
        return { success: true };
    }

}
