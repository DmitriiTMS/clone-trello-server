import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDto } from './dto/task.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  create(@Body() taskDto: TaskDto, @CurrentUser('id') userId: string) {
    return this.tasksService.create(taskDto, userId);
  }

  @Get()
  @Auth()
  findAll(@CurrentUser('id') userId: string) {
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() taskDto: TaskDto,
  ) {
    return this.tasksService.update(id, userId, taskDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth()
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
