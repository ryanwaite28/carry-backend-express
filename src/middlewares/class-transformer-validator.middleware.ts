import { NextFunction, Request, Response } from "express";
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { HttpStatusCode } from "../enums/http-codes.enum";
import { ServiceMethodAsyncResults, ServiceMethodResults } from "../interfaces/common.interface";
import { ValidationError } from "class-validator";



export function ValidateRequestBodyDto (ClassConstructor: ClassType<object>, validateFn?: (dataDto: any) => ServiceMethodAsyncResults) {

  return async (request: Request, response: Response, next: NextFunction) => {
    console.log(`\n\n\n======= BEGIN ValidateRequestBodyDto Middleware =======`);
    let dataDto;

    try {
      dataDto = await transformAndValidate(ClassConstructor, request.body);
      console.log(`dataDto:`, dataDto);
    }
    catch (err) {
      // get the first validation error
      const errors: ValidationError[] = err as ValidationError[];
      const firstError = errors[0];
      const errorKeys = Object.keys(firstError.constraints);
      const errorMessage: string = firstError.constraints['isNotEmpty'] || firstError.constraints[errorKeys[0]]; // check if empty first before any other errors

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: errorMessage,
          data: errors,
        }
      };
      console.error(errors);
      console.log(`======= END ValidateRequestBodyDto; NEXT =======\n\n\n`);
      return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
    }

    try {
      if (validateFn) {
        const results = await validateFn(dataDto);
        if (results.error) {
          return response.status(results.status).json(results.info);
        }
      }
      response.locals[`dto`] = dataDto;
      console.log(`======= END ValidateRequestBodyDto; NEXT =======\n\n\n`);
      return next();
    }
    catch (errors) {
      console.error(errors);
      return response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Given validator function failed...`, errors });
    }

  }

}