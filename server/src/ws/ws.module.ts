import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
    providers: [EventsGateway],
    exports: [EventsGateway], // позволяет использовать в других модулях
})
export class WsModule {}
