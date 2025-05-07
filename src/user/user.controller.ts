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
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchDTO } from './dto/update-patch.dto';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() { email, name, password }: CreateUserDTO) {
    return { email, name, password };
  }

  @Get()
  async read() {
    return {
      users: [
        { email: 'teste@domain.com', name: 'teste', password: '******' },
        { email: 'teste@domain.com', name: 'teste2', password: '******' },
      ],
    };
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id: number) {
    return { user: {}, id };
  }

  @Put(':id')
  async update(
    @Body() { email, name, password }: UpdateUserDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      method: 'put',
      email,
      name,
      password,
      params: { id },
    };
  }

  @Patch(':id')
  async updatePartial(
    @Body() { email, name, password }: UpdatePatchDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return { method: 'patch', email, name, password, id };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      id,
    };
  }
}
