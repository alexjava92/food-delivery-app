import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async generateJwtToken(payload) {
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: 60*600000
        })
    }
}
