import {Controller, Get} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ContactsService} from "./contacts.service";


@ApiTags('Заказы')
@Controller('api/contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {
    }

    @Get()
    findAll() {
        return this.contactsService.findOne(1);
    }


}
