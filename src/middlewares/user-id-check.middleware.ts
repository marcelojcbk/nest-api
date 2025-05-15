import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const paramId = req.params.id;

    console.log('useridmid: antes');
    if (isNaN(Number(paramId)) || Number(paramId) <= 0) {
      throw new BadRequestException('ID invalido');
    }

    console.log('useridmid: depois');

    next(); //avançar para proximo middleware
  }
}
