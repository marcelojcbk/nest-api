import { CreateUserDTO } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePatchDTO extends PartialType(CreateUserDTO) {}
