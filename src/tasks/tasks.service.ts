import { BadRequestException, Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(taskDto: TaskDto, userId: string) {
    return await this.prisma.task.create({
      data: {
        ...taskDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.task.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(taskId: string, userId: string, taskDto: Partial<TaskDto>) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task)
      throw new BadRequestException(`Задача для обновления не найдена`);

    return await this.prisma.task.update({
      where: {
        userId,
        id: taskId,
      },
      data: taskDto,
    });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new BadRequestException(`Задача для удаления не найдена`);

    return await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
