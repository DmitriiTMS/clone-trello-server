import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { SettingDto } from './dto/setting.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: string) {
    return await this.userService.getOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  async updateProfile(@CurrentUser('id') id: string, @Body() dto: SettingDto) {
    return await this.userService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
