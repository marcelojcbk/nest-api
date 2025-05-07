import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserMoule } from './user/user.module';

@Module({
  imports: [UserMoule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
