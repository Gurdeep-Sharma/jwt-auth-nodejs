import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export class ValidationResult {
  data: any;
  error: any;
}
class Utility {
  ValidateAndConvert = async (classToConvert: any, body: string) => {
    const result = new ValidationResult();
    result.data = plainToClass(classToConvert, body);
    await validate(result.data, { skipMissingProperties: true }).then(
      (errors) => {
        // errors is an array of validation errors
        if (errors.length > 0) {
          result.error = errors.map((err) => err.constraints);
          return result;
        }
      }
    );
    return result;
  };
}

export default new Utility();
