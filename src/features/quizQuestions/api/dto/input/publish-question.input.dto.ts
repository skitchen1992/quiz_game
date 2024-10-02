import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Trim } from '@infrastructure/decorators/transform/trim';

export class PublishQuestionInputDto {
  @IsBoolean({ message: 'Published must be a boolean' })
  @IsNotEmpty({ message: 'Published is required' })
  published: boolean;
}
