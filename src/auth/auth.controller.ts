import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgotDTO } from './dto/auth-forgot.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { User } from 'src/decorators/user.decorator';
import { LogInterceptor } from 'src/interceptors/log.interceptors';

@UseInterceptors(LogInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forgot') //forgot email
  async forgot(@Body() { email }: AuthForgotDTO) {
    return this.authService.forgot(email);
  }

  @Post('reset') //reset password
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User('email') user) {
    return { user };
    // return this.authService.checkToken(body.token);
  }
}
