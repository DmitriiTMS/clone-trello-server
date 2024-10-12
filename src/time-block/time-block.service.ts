import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TimeBlockDto } from './dto/time-block.dto';

@Injectable()
export class TimeBlockService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return await this.prisma.timeBlock.findMany({
      where: {
        userId,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async create(dto: TimeBlockDto, userId: string) {
    return await this.prisma.timeBlock.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(
    timeBlockId: string,
    userId: string,
    dto: Partial<TimeBlockDto>,
  ) {
    const timeBlock = await this.prisma.timeBlock.findUnique({
      where: { id: timeBlockId },
    });

    if (!timeBlock)
      throw new BadRequestException(`TimeBlock для обновления не найдена`);

    return await this.prisma.timeBlock.update({
      where: {
        userId,
        id: timeBlockId,
      },
      data: dto,
    });
  }

  async remove(timeBlockId: string, userId: string) {
    const timeBlock = await this.prisma.timeBlock.findUnique({
      where: { id: timeBlockId, userId },
    });

    if (!timeBlock)
      throw new BadRequestException(`TimeBlock для удаления не найдена`);

    return await this.prisma.timeBlock.delete({
      where: { id: timeBlockId, userId },
    });
  }

  async updateOrder(ids: string[]) {
    return await this.prisma.$transaction(
      ids.map((id, order) =>
        this.prisma.timeBlock.update({
          where: { id },
          data: { order },
        }),
      ),
    );
  }
}
