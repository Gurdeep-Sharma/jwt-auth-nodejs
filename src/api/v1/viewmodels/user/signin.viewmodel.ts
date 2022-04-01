import { Expose, Type } from "class-transformer";
import {
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches
} from "class-validator";

export class SignInViewmodel {
  @Expose()
  @IsDefined()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Type(() => String)
  email: string;

  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
    message:
      "Password sholud have min 8 letters, with at least a symbol, upper and lower case letters and a number",
  })
  @Type(() => String)
  password: string;
}
