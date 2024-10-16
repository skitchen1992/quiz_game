import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PublishQuestionInputDto {
  @IsBoolean({ message: 'Published must be a boolean' })
  @IsNotEmpty({ message: 'Published is required' })
  published: boolean;
}
