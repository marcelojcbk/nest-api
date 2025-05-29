import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from 'src/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface CheckTokenProps {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  // async checkToken(token: string): Promise<CheckTokenProps> {
  //   try {
  //     const data = await this.jwtService.verifyAsync<CheckTokenProps>(token, {
  //       issuer: this.issuer,
  //       audience: this.audience,
  //     });
  //     return data;
  //   } catch (e) {
  //     throw new BadRequestException(e);
  //   }
  // }

  isValidToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const isValid = this.checkToken(token);
      if (isValid) {
        return true;
      }
      return false;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha incorretos.');
    }

    const comparedPasswords = await bcrypt.compare(password, user.password);

    if (!comparedPasswords) {
      throw new UnauthorizedException('Email e/ou senha incorretos.');
    }

    return this.createToken(user);
  }

  async forgot(email: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('Email está incorreto.');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailerService.sendMail({
      subject: 'Recuperação de senha',
      to: 'marceloteste@tst.com',
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });

    return user;
  }

  async reset(password: string, token: string) {
    try {
      const data: any = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('token invalido!');
      }

      const salt = await bcrypt.genSalt();

      password = await bcrypt.hash(password, salt);

      await this.usersRepository.update(Number(data.id), {
        password,
      });

      const user = await this.userService.listOne(Number(data.id));

      if (!user) {
        throw new BadRequestException('Usuário não encontrado!');
      }

      return this.createToken(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }
}
