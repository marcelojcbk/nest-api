import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchDTO } from './dto/update-patch.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    return this.prisma.user.create({
      data,
      //   select: {  //select utilizado para selecionar o que voce quer
      //     id: true,//que o prisma retorne ao finalizar a query
      //   },
    });
  }

  async listAll() {
    return this.prisma.user.findMany({});
  }

  async listOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, { birthAt, name, email, password }: UpdateUserDTO) {
    return this.prisma.user.update({
      data: {
        birthAt: birthAt ? new Date(birthAt) : null,
        name,
        email,
        password,
      },
      where: {
        id,
      },
    });
  }

  async updatePartial(id: number, data: UpdatePatchDTO) {
    const updatedData = {
      ...data,
      birthAt: data.birthAt ? new Date(data.birthAt) : undefined,
    };

    return this.prisma.user.update({
      data: updatedData,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
