import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile } from 'fs';

@Injectable()
export class FileService {
  async upload(file: Express.Multer.File, path: string) {
    await writeFile(path, file.buffer, (err) => {
      if (err) {
        throw new BadRequestException(err);
      } else {
        console.log('upload concluido!');
      }
    });
  }
}
