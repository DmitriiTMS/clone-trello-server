import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SettingDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Введите валидное значение email' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Поле пароль должно быть не менее 6 символов' })
  password: string;
}
