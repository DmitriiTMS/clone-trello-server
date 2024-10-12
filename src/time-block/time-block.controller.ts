import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { TimeBlockDto } from './dto/time-block.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('time-block')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @Get()
  @Auth()
  getAll(@CurrentUser('id') userId: string) {
    return this.timeBlockService.getAll(userId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  create(@Body() dto: TimeBlockDto, @CurrentUser('id') timeBlockId: string) {
    return this.timeBlockService.create(dto, timeBlockId);
  }

  @Patch('update-order')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  async updateOrder(@Body() dto: UpdateOrderDto) {
    return await this.timeBlockService.updateOrder(dto.ids);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: TimeBlockDto,
  ) {
    return this.timeBlockService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth()
  remove(@Param('id') id: string, @CurrentUser('id') timeBlockId: string) {
    return this.timeBlockService.remove(id, timeBlockId);
  }

 
}
