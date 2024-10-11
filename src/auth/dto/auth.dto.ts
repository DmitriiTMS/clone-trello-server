import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {

  @IsEmail({}, { message: 'ВВедите валидное значение email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Поле пароль должно быть не менее 6 символов' })
  password: string;
}
