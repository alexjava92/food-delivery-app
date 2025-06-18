import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {SearchService} from './search.service';
import {Query} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Поиск')
@Controller('api/search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {
    }
    @Get('')
    async search(@Query() query: string) {
        return this.searchService.search(query);
    }
}
