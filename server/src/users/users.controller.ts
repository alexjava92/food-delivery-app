import {Body, Controller, Get, Param, Patch, Query, UseGuards,} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersDto} from './users.dto';
import {UsersModel} from './users.model';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from "../auth/auth.guard";
import {ProductsModel} from "../products/products.model";

@ApiTags('Пользователь')
@Controller('api/user')
export class UsersController {
    constructor(private usersService: UsersService) {
    }
    @ApiOperation({summary: 'Получение всех пользователей'})
    @ApiResponse({status: 200, type: UsersModel})
    @Get('')
    getAll() {
        return this.usersService.getAll();
    }

    @Get('/role')
    getAllByRole(@Query('role') role: string) {
        return this.usersService.getAllByRole(role);
    }

    @Get('/search')
    async search(@Query() query: {name:string}) {
        console.log('query',query)
        return this.usersService.search(query.name);
    }


    @ApiOperation({summary: 'Получение пользователя'})
    @ApiResponse({status: 200, type: UsersModel})
    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
    @UseGuards(JwtAuthGuard)
    @Patch('/update/:id')
    updateRole(@Param('id')  id:string,@Body() body) {
        return this.usersService.updateRoleUser(id,body);
    }

    @ApiOperation({summary: 'Обновление данных пользователя'})
    @ApiResponse({status: 200, type: UsersModel})
    @Patch('/:id')
    update(@Param('id') id: number, @Body() dto: UsersDto) {
        return this.usersService.updateUser(id, dto);
    }
}
