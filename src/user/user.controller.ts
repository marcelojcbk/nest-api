import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Put,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchDTO } from './dto/update-patch.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptors';
import { ParamId } from 'src/decorators/param-id.decorator';
@UseInterceptors(LogInterceptor)
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
  async readOne(@ParamId() id: number) {
    return this.userService.listOne(id);
  }

  @Put(':id')
  async update(@Body() data: UpdateUserDTO, @ParamId() id: number) {
    return this.userService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchDTO, @ParamId() id: number) {
    return this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
