import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService} from "@nestjs/jwt";
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); 
@Injectable()
export class AuthGuard implements CanActivate {
    constructor (private jwtService: JwtService, private reflector: Reflector) {}

async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(), 
        context.getClass()]);

        if (isPublic) {
            return true;
        }
    console.log('Token recibido:', token);

    if (!token) {
        throw new UnauthorizedException('token no proporcionado');
    }
     try {
    const payload = await this.jwtService.verifyAsync(token, {
    secret: process.env.SECRET,
        
});

         console.log('Payload decodificado:', payload);
         }
       
      catch(error){
         console.error('Error verificando token:');
         throw new UnauthorizedException('Token inválido o expirado');
        }
        return true;
}

private extractToken(request: Request): string | undefined {
const [type, token] = request.headers.authorization?.split(' ') ?? [];
return type === 'Bearer' ? token : undefined 
}
}