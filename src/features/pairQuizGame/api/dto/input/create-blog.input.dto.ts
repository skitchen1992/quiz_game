import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString } from 'class-validator';

export class AnswerDto {
  @IsString({ message: 'Answer must be a string' })
  @Trim()
  @IsNotEmpty({ message: 'Answer is required' })
  answer: string;
}
