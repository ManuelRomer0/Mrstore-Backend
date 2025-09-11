import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    identifier!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    identifier!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @IsNotEmpty()
    confirmPassword!: string;
}
export class UserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @MinLength(6)
    password?: string;
}