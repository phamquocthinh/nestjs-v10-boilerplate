import { ApiProperty } from '@nestjs/swagger';
import { IsExist } from 'src/shared/validators/is-exists.validator';
import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/shared/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
