import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title cannot be longer than 100 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot be longer than 500 characters' })
  description?: string;
}
