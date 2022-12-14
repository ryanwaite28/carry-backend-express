export function uniqueValue() {
  return String(Date.now()) +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34);
}

export function capitalize(str: string) {
  if (!str) {
    return '';
  } else if (str.length < 2) {
    return str.toUpperCase();
  }
  const Str = str.toLowerCase();
  const capitalized = Str.charAt(0).toUpperCase() + Str.slice(1);
  return capitalized;
}

export function getRandomIndex(array: any[]) {
  const badInput = !array || !array.length;
  if (badInput) {
    return null;
  }
  const indexList = array.map((item, index) => index);
  const randomIndex = Math.floor(Math.random() * indexList.length);
  const item = indexList[randomIndex];
  return item;
}

export function getRandomItem(array: any[]) {
  const badInput = !array || !array.length;
  if (badInput) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  const item = array[randomIndex];
  return item;
}



import { IMyModel, IUser } from "../interfaces/carry.interface";
import { Model } from 'sequelize';
import {
  sign as jwt_sign,
  verify as jwt_verify
} from 'jsonwebtoken';
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import { UploadedFile } from 'express-fileupload';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { ServiceMethodResults, IModelValidator, PlainObject, ServiceMethodAsyncResults } from '../interfaces/common.interface';
import { IStoreImage, store_base64_image, store_image } from "./cloudinary-manager.utils";
import { allowedImages } from "./constants.utils";
import { validateName, validateEmail, validatePassword, numberValidator, genericTextValidator } from "./validators.utils";




export const check_model_args = async (options: {
  model_id?: number,
  model?: IMyModel,
  model_name?: string,
  get_model_fn: (id: number) => Promise<IMyModel | null>
}) => {
  const { model_id, model, model_name, get_model_fn } = options;
  const useName = model_name || 'model';

  if (!model_id && !model) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: `${useName} id or model instance is required.`
      }
    };
    return serviceMethodResults;
  }
  const model_model: IMyModel | null = model || await get_model_fn(model_id!);
  if (!model_model) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.NOT_FOUND,
      error: true,
      info: {
        message: `${useName} not found...`,
      }
    };
    return serviceMethodResults;
  }

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: model_model,
    }
  };
  return serviceMethodResults;
};

export const getUserFullName = (user: IUser) => {
  if (user) {
    const { firstname, middlename, lastname } = user;
    const middle = middlename
      ? ` ${middlename} `
      : ` `;

    const displayName = `${firstname}${middle}${lastname}`;
    return displayName;
  } else {
    return '';
  }
};

export const create_user_required_props: IModelValidator[] = [
  // { field: `username`, name: `Username`, validator: validateUsername, errorMessage: `must be: at least 2 characters, alphanumeric, dashes, underscores, periods` },
  // { field: `displayname`, name: `DisplayName`, validator: validateDisplayName, errorMessage: `must be: at least 2 characters, alphanumeric, dashes, underscores, periods, spaces`, },
  { field: `firstname`, name: `First Name`, validator: validateName, errorMessage: `must be: at least 2 characters, letters only`, },
  // { field: `middlename`, name: `Middle Name`, validator: (arg: any) => !arg || validateName(arg), errorMessage: `must be: at least 2 characters, letters only`, },
  { field: `lastname`, name: `Last Name`, validator: validateName, errorMessage: `must be: at least 2 characters, letters only`, },
  { field: `email`, name: `Email`, validator: validateEmail, errorMessage: `is in bad format`, },
  { field: `password`, name: `Password`, validator: validatePassword, errorMessage: `Password must be: at least 7 characters, upper and/or lower case alphanumeric`, },
  { field: `confirmPassword`, name: `Confirm Password`, validator: validatePassword, errorMessage: `Confirm Password must be: at least 7 characters, upper and/or lower case alphanumeric`, },
];

export const VALID_RATINGS = new Set([1, 2, 3, 4, 5]);
export const create_rating_required_props: IModelValidator[] = [
  { field: `user_id`, name: `User Id`, validator: (arg: any) => numberValidator(arg) && parseInt(arg) > 0, errorMessage: `is required` },
  { field: `writer_id`, name: `Writer Id`, validator: (arg: any) => numberValidator(arg) && parseInt(arg) > 0, errorMessage: `is required` },
  { field: `rating`, name: `Rating`, validator: (arg: any) => numberValidator(arg) && VALID_RATINGS.has(parseInt(arg)), errorMessage: `must be 1-5` },
  { field: `title`, name: `Title`, validator: genericTextValidator, errorMessage: `must be: at least 3 characters, alphanumeric, dashes, underscores, periods, etc` },
  { field: `summary`, name: `Summary`, validator: genericTextValidator, errorMessage: `must be: at least 3 characters, alphanumeric, dashes, underscores, periods, etc` },
];




export const convertModel = <T> (model: IMyModel | Model | null) => {
  return model ? (<any> model.toJSON()) as T : null;
}

export const convertModels = <T> (models: (IMyModel | Model)[]) => {
  return models.map((model) => (<any> model.toJSON()) as T);
}

export const convertModelCurry = <T> () => (model: IMyModel | Model | null) => {
  return model ? (<any> model.toJSON()) as T : null;
}

export const convertModelsCurry = <T> () => (models: (IMyModel | Model)[]) => {
  return models.map((model) => (<any> model.toJSON()) as T);
}


export function generateJWT(data: any, secret?: string) {
  // console.log(`generateJWT:`, { data });
  try {
    const jwt_token = jwt_sign(data, secret || (<string> process.env.JWT_SECRET));
    return jwt_token || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function decodeJWT(token: any, secret?: string) {
  try {
    const data = jwt_verify(token, secret || (<string> process.env.JWT_SECRET));
    // console.log(`decodeJWT:`, { data });
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function AuthorizeJWT(
  request: Request,
  checkUrlYouIdMatch: boolean = true,
  secret?: string,
): {
  error: boolean;
  status: HttpStatusCode;
  message: string;
  you?: IUser;
} {
  try {
    /* First, check Authorization header */
    const auth = request.get('Authorization');
    if (!auth) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: missing Authorization header`
      };
    }
    const isNotBearerFormat = !(/Bearer\s[^]/).test(auth);
    if (isNotBearerFormat) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: Authorization header must be Bearer format`
      };
    }

    /* Check token validity */
    const token = auth.split(' ')[1];
    let you;
    try {
      you = decodeJWT(token, secret) || null;
    } catch (e) {
      console.log(e);
      you = null;
    }
    if (!you) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: invalid token`
      };
    }

    /* Check if user id match the `you_id` path param IF checkUrlIdMatch = true */
    if (checkUrlYouIdMatch) {
      const you_id: number = parseInt(request.params.you_id, 10);
      const notYou: boolean = you_id !== (<IUser> you).id;
      if (notYou) {
        return {
          error: true,
          status: HttpStatusCode.UNAUTHORIZED,
          message: `Request not authorized: You are not permitted to complete this action`
        };
      }
    }

    /* Request is okay */
    return {
      error: false,
      status: HttpStatusCode.OK,
      message: `user authorized`,
      you: (<IUser> you),
    };
  } catch (error) {
    console.log(`auth jwt error:`, error);
    return {
      error: true,
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: `Request auth failed...`
    };
  }
}



export const validateData = (options: {
  data: any,
  validators: IModelValidator[],
  mutateObj?: any
}): ServiceMethodResults => {
  const { data, validators, mutateObj } = options;
  const dataObj: any = {};

  for (const prop of validators) {
    if (!data.hasOwnProperty(prop.field)) {
      if (prop.optional) {
        if (prop.defaultValue) {
          dataObj[prop.field] = prop.defaultValue;
        }
        continue;
      }

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `${prop.name} is required.`
        }
      };
      return serviceMethodResults;
    }
    const isValid: boolean = prop.validator(data[prop.field]);
    if (!isValid) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: prop.errorMessage ? `${prop.name} ${prop.errorMessage}` : `${prop.name} is invalid.`
        }
      };
      return serviceMethodResults;
    }
    
    dataObj[prop.field] = data[prop.field];
  }

  if (mutateObj) {
    Object.assign(mutateObj, dataObj);
  }

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      message: `validation passed.`,
      data: dataObj,
    }
  };
  return serviceMethodResults;
}

export const validateAndUploadImageFile = async (
  image_file: string | UploadedFile | undefined,
  options?: {
    treatNotFoundAsError: boolean,

    mutateObj?: PlainObject,
    id_prop?: string,
    link_prop?: string;
  }
): ServiceMethodAsyncResults => {
  if (!image_file) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: options && options.hasOwnProperty('treatNotFoundAsError') ? options.treatNotFoundAsError : true,
      info: {
        message: `No image file found/given`
      }
    };
    return serviceMethodResults;
  }



  let image_results: IStoreImage;
  
  if (typeof image_file === 'string') {
    // base64 string provided; attempt parsing...
    image_results = await store_base64_image(image_file);
  }
  else {
    const type = (<UploadedFile> image_file).mimetype.split('/')[1];
    const isInvalidType = !allowedImages.includes(type);
    if (isInvalidType) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: 'Invalid file type: jpg, jpeg or png required...'
        }
      };
      return serviceMethodResults;
    }
    image_results = await store_image(image_file);
  }

  if (!image_results.result) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      error: true,
      info: {
        message: 'Could not upload file...',
        data: image_results
      }
    };
    return serviceMethodResults;
  }

  if (options && options.mutateObj && options.id_prop && options.link_prop) {
    options.mutateObj[options.id_prop] = image_results.result.public_id;
    options.mutateObj[options.link_prop] = image_results.result.secure_url;
  }

  const serviceMethodResults: ServiceMethodResults<{
    image_results: any,
    image_id: string,
    image_link: string,
  }> = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: {
        image_results,
        image_id: image_results.result.public_id,
        image_link: image_results.result.secure_url
      }
    }
  };
  return serviceMethodResults;
};