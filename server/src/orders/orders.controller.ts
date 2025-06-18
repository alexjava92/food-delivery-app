import {Controller, Get, Post, Body, Param, Patch, UseGuards, Query} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {CreateOrderDto} from './dto/create-order.dto';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {OrdersModel} from "./orders.model";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {JwtAuthGuard} from "../auth/auth.guard";

@ApiTags('Заказы')
@Controller('api/orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {
    }

    @ApiOperation({summary: 'Создание заказа'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(dto);
    }

    @ApiOperation({summary: 'Получение всех заказов'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Get()
    findAll(@Query() query: {page:string}) {
        return this.ordersService.findAllOrder(query.page);
    }
    @ApiOperation({summary: 'Получение статистики'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Get('statistics')
    statistics(@Query() query: string) {
        return this.ordersService.statistics(query);
    }

    @ApiOperation({summary: 'Получение заказов пользователя'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Get('user/:id')
    findAllOrdersUser(@Param('id') id: string) {
        return this.ordersService.findAllOrdersUser(+id);
    }

    @ApiOperation({summary: 'Получение одного заказа'})
    @ApiResponse({status: 200, type: OrdersModel})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOneOrder(+id);
    }


    @Patch('user/:id')
    updateNotification(@Param('id') id: number, @Body() dto: UpdateOrderDto,) {
        return this.ordersService.updateOrder(+id, dto,);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateStatus(@Param('id') id: number, @Body() dto: UpdateOrderDto,) {
        return this.ordersService.updateOrder(+id, dto,);
    }
}
