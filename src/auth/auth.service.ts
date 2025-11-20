import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, encrypt } from 'src/libs/bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { UserDto } from './dto/user.dto';
import { SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // LOGIN - Email o Username
  async login(identifier: string, password: string) {
    try {
      if (!identifier) {
        throw new BadRequestException(
          'Debe proporcionar un correo electrónico o un nombre de usuario',
        );
      }

      // Detectar si es email usando regex
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      // Buscar usuario dinámicamente
      const user = await this.prismaService.user.findFirst({
        where: isEmail ? { email: identifier } : { username: identifier },
      });

      if (!user) {
        throw new BadRequestException('Usuario o contraseña incorrecta');
      }

      // Validar contraseña
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Usuario o contraseña incorrecta');
      }

      // Generar token limpio
      const { password: _, ...userWithoutPassword } = user;
      const access_token = await this.jwtService.signAsync(userWithoutPassword);

      return { access_token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al iniciar sesión');
    }
  }

  // SIGNUP - Registro con Email o Username
  // ===========================
  async signUp(user: SignUpDto) {
    try {
      // Validación de contraseñas
      if (user.password !== user.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      if (!user.username) {
        throw new BadRequestException('Debe proporcionar un nombre de usuario');
      }

      if (!user.email) {
        throw new BadRequestException(
          'Debe proporcionar un correo electrónico',
        );
      }

      // Verificar si el usuario ya existe
      const existingUser = await this.prismaService.user.findFirst({
        where: { email: user.email, username: user.username },
      });

      if (existingUser) {
        throw new BadRequestException('El usuario ya existe');
      }

      // Encriptar contraseña
      const hashedPassword = await encrypt(user.password);

      // Crear usuario
      const newUser = await this.prismaService.user.create({
        data: {
          username: user.username,
          email: user.email,
          password: hashedPassword,
        },
      });

      // Generar token limpio con username o email
      const cleanUser = {
        id: newUser.id,
        username: newUser.username ?? newUser.email, // Usa username si existe, si no el email
        email: newUser.email,
      };

      const access_token = await this.jwtService.signAsync(cleanUser);

      return { access_token };
    } catch (error: any) {
      // 🔥 Mostrar el error completo para depuración
      console.error('🔥 ERROR COMPLETO:', error);

      // Si el error es una excepción nuestra, como BadRequestException
      if (error instanceof BadRequestException) {
        throw error;
      }

      // ✅ Si el error es de Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('⚠️ Prisma Error Code:', error.code);
        console.error('⚠️ Prisma Error Meta:', error.meta);

        if (error.code === 'P2022') {
          throw new InternalServerErrorException(
            `Error Prisma: columna inexistente en modelo ${error.meta?.modelName}, columna ${error.meta?.column}`,
          );
        }
      }

      // ❌ Para cualquier otro error desconocido
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }
  async updateUser(id: string, data: Partial<UserDto>) {
    // Verificar si el usuario existe
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: Number(id) }, // Si es UUID, usa solo `id`
    });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar el usuario
    return this.prismaService.user.update({
      where: { id: Number(id) }, // o `id` si es UUID
      data,
    });
  }
  async getAllUsers() {
    return this.prismaService.user.findMany();
  }
}
