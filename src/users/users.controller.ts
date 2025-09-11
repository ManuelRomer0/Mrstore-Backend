import {Body, Controller, Get, Param, Put} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/auth/dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';



@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
) {};
    

    @Get()
    getUsers() {
        return this.usersService.getUsers() ;

    }   
}