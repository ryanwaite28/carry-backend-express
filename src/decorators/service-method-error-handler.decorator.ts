import { HttpStatusCode } from '../enums/http-codes.enum';
import { ServiceMethodResults } from '../interfaces/common.interface';



export function CatchRequestHandlerError(options?: {
  throwError?: boolean,
  errorMessage?: string,
}) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // console.log(`CatchRequestHandlerError init:`, { target, key, descriptor });
    const childFunction = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      console.log(`CatchRequestHandlerError dec:`, { target, key, descriptor, childFunction, args });
      try {
        return await childFunction.apply(this, args);
      } 
      catch (error) {
        console.error(options?.errorMessage || `CatchRequestHandlerError:`, error);

        if (options?.throwError) {
          throw error;
        }

        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: true,
          info: {
            message: `Error in request handler method; something went wrong...`,
            error,
            data: {
              errorMessage: options?.errorMessage,
              target,
              key
            }
          }
        };

        console.log(`returning handler error catch:`, serviceMethodResults);
        return serviceMethodResults; 
      }
    };

  }
}


export function MethodLogger(options?: {
  throwError?: boolean,
  errorMessage?: string,
}) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    console.log(`MethodLogger init:`, { target, key, descriptor });
    const childFunction = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const label = Date.now().toString();
      console.log(`running ${key.toString()} ...`, label);
      return childFunction.apply(this, args);
    };

  }
}

export function CatchServiceError(options?: {
  throwError?: boolean,
  errorMessage?: string,
}) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const childFunction = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      console.log(`CatchServiceError dec:`, { target, key, descriptor, childFunction, args });
      try {
        // @ts-ignore
        return childFunction.apply(this, args);
      } catch (error) {
        console.error(options?.errorMessage || `CatchServiceError:`, error);

        if (options?.throwError) {
          throw error;
        }

        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: true,
          info: {
            message: `Error in service method; something went wrong...`,
            error,
            data: {
              errorMessage: options?.errorMessage,
              target,
              key
            }
          }
        };
        return serviceMethodResults; 
      }
    };

  }
}

export function CatchAsyncServiceError(options?: {
  throwError?: boolean,
  errorMessage?: string,
}) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const childFunction = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      console.log(`CatchAsyncServiceError dec:`, { target, key, descriptor, childFunction, args });
      try {
        // @ts-ignore
        const value = await childFunction.apply(this, args);
        return value;
      } catch (error) {
        console.error(options?.errorMessage || `CatchAsyncServiceError:`, error);

        if (options?.throwError) {
          throw error;
        }

        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: true,
          info: {
            message: `Error in service method; something went wrong...`,
            error,
            data: {
              errorMessage: options?.errorMessage,
              target,
              key
            }
          }
        };
        return serviceMethodResults; 
      }
    };

  }
}

export function ApplyToAllMethods(useDecorator?: Function) {

  console.log(`useDecorator:`, useDecorator, useDecorator?.prototype, JSON.stringify(useDecorator));

  return (classConstructor: Function) => {
    console.log(`classDef:`, classConstructor, classConstructor.prototype, JSON.stringify(classConstructor));

    const useTarget = classConstructor.prototype;
    console.log(`useTarget:`, useTarget);

    for (const propertyName of Object.getOwnPropertyNames(useTarget)) {
      const descriptor = Object.getOwnPropertyDescriptor(useTarget, propertyName);
      const isMethod = descriptor.value instanceof Function;
      console.log(`propertyName:`, propertyName, descriptor, isMethod);
      if (!isMethod || propertyName === `constructor`) {
        return;
      }

      const isCurryFn = !!useDecorator && useDecorator instanceof Function && useDecorator() instanceof Function;
      if (isCurryFn) {
        throw new Error(`Currying functions are not allowed as decorator argument`);
      }
      
      useDecorator && useDecorator(useTarget, propertyName, descriptor);
      
      Object.defineProperty(useTarget, propertyName, descriptor);        
    }

  }

}

