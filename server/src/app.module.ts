import {Module} from '@nestjs/common';
import {CategoriesModule} from './categories/categories.module';
import {SequelizeModule} from '@nestjs/sequelize';
import {ConfigModule} from '@nestjs/config';
import {CategoriesModel} from './categories/categories.model';
import {ProductsModule} from './products/products.module';
import {ProductsModel} from './products/products.model';
import {ServeStaticModule} from '@nestjs/serve-static';
import * as path from 'path'
import {UsersModule} from "./users/users.module";
import {UsersModel} from "./users/users.model";
import {OrdersModule} from './orders/orders.module';
import {OrdersModel} from './orders/orders.model';
import {OrderProductsModel} from './orders/ordersProducts.model';
import {SearchModule} from './search/search.module';
import {AuthModule} from './auth/auth.module';
import {TokenModule} from './token/token.module';
import {BotModule} from './bot/bot.module';
import {TextMessageModule} from './text-message/text-message.module';
import {TextMessageModel} from "./text-message/text-message.model";
import {ContactsModule} from './contacts/contacts.module';
import {ContactsModel} from "./contacts/contacts.model";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, '..', 'static')}),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.DATA_BASE_HOST,
            port: +process.env.DATA_BASE_PORT,
            username: process.env.DATA_BASE_USERNAME,
            password: process.env.DATA_BASE_PASSWORD,
            database: process.env.DATA_BASE_NAME,
            models: [ProductsModel, CategoriesModel, UsersModel, OrdersModel, OrderProductsModel, TextMessageModel, ContactsModel],
            autoLoadModels: true,
        }),
        ProductsModule,
        CategoriesModule,
        UsersModule,
        OrdersModule,
        SearchModule,
        AuthModule,
        TokenModule,
        BotModule,
        TextMessageModule,
        ContactsModule
    ],
})
export class AppModule {
}
