import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Put,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchDTO } from './dto/update-patch.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Get()
  async listAll() {
    return this.userService.listAll();
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.listOne(id);
  }

  @Put(':id')
  async update(
    @Body() data: UpdateUserDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.exists(id);

    return this.userService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.exists(id);

    return this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.exists(id);

    return this.userService.delete(id);
  }

  async exists(id: number){
    if (!(await this.readOne(id))) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}
