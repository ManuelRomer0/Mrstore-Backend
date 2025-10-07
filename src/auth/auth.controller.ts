import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guards/auth.guard';
import { SignUpDto, LoginDto, UserDto } from './dto/auth.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =======================
  // LOGIN
  // =======================
  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  login(@Body() user: LoginDto) {
    if (!user.identifier) {
      throw new BadRequestException(
        'Debe proporcionar un correo electrónico o un nombre de usuario',
      );
    }
    return this.authService.login(user.identifier, user.password);
  }

  // =======================
  // SIGN UP
  // =======================
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() user: SignUpDto) {
    console.log('Datos recibidos para registro:', user);
    return this.authService.signUp(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: Partial<UserDto>) {
    return this.authService.updateUser(String(id), data);
  }
}
