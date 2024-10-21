import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Trim } from '@infrastructure/decorators/transform/trim';

export class CreateQuestionInputDto {
  @IsString({ message: 'Body must be a string' })
  @Trim()
  @Length(10, 500, { message: 'Body must be between 1 and 500 characters' })
  @IsNotEmpty({ message: 'Body is required' })
  body: string;

  @IsArray({ message: 'CorrectAnswers must be an array' })
  @ArrayNotEmpty({ message: 'CorrectAnswers array must not be empty' })
  @IsString({ each: true, message: 'Each correct answer must be a string' })
  @IsNotEmpty({ each: true, message: 'Each correct answer must not be empty' })
  correctAnswers: string[];
}
