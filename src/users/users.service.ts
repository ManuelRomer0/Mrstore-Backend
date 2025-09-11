import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async getUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });
    }
}