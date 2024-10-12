import { Priority } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  name: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsEnum(Priority)
  @IsOptional()
  @Transform(({ value }) => ('' + value).toUpperCase())
  priority: Priority;
}
