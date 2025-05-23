import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Put,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchDTO } from './dto/update-patch.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptors';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guards';
import { AuthGuard } from 'src/guards/auth.guards';
// import { Throttle } from '@nestjs/throttler';
// import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@SkipThrottle() para ignorar o rateLimit
  ///@Throttle(20,60) para alterar os parametros do ratelimit
  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Roles(Role.Admin)
  @Get()
  async listAll() {
    return this.userService.listAll();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async readOne(@ParamId() id: number) {
    return this.userService.listOne(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Body() data: UpdateUserDTO, @ParamId() id: number) {
    return this.userService.update(id, data);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchDTO, @ParamId() id: number) {
    return this.userService.updatePartial(id, data);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
