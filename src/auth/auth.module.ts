import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { authService } from "./auth.service";
import { JwtStrategy } from "./strategy";


@Module({
    imports:[JwtModule.register({
        
    })],
    controllers: [AuthController],
    providers: [authService, JwtStrategy]
})

export class AuthModule {} 