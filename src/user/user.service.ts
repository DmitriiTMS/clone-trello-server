import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';
import { SettingDto } from './dto/setting.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        name: true,
        email: true,
        isHasPremium: true,
        role: true,
      },
    });
  }

  async getOne(id: string) {
    const user = await this.getById(id);

    if (!user)
      throw new BadRequestException(`Пользователь для отображения не найден`);

    const { password, ...resultUser } = user;

    return resultUser;
  }

  async getById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });
  }

  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        tasks: true,
      },
    });
  }

  async create(dto: AuthDto) {
    const user = {
      name: dto.name,
      email: dto.email,
      password: await hash(dto.password),
    };

    return this.prisma.user.create({
      data: user,
    });
  }

  async update(id: string, dto: SettingDto) {
    const user = await this.getById(id);

    if (!user)
      throw new BadRequestException(`Пользователь для обновления не найден`);

    let data = dto;

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) };
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        name: true,
        email: true,
      },
    });
  }

  async delete(id: string) {
    const user = await this.getById(id);

    if (!user)
      throw new BadRequestException(`Пользователь для удаления не найден`);

    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async getProfile(id: string) {
    const profile = await this.getById(id);

    return profile;
  }
}
