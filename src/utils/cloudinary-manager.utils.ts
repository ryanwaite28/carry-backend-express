import { uniqueValue } from "./helpers.utils";

const cloudinary = require('cloudinary').v2;
const fs = require('fs');



export interface IUploadFile {
  error: boolean;
  filename?: string;
  image_path?: string;
  message?: string;
}

export function upload_file(file: any): Promise<IUploadFile> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject({error: true, filename: undefined, image_path: undefined, message: 'no file given...'});
    }
    const unique_filename = uniqueValue();
    const filename = unique_filename + (<string> file.name);
    const image_path = __dirname + '/' + filename;
    file.mv(filename, (error: any) => {
      if (error) {
        return reject({error: true, filename: undefined, image_path: undefined, message: 'could not upload file...'});
      } else {
        return resolve({ error: false, filename, image_path, message: undefined });
      }
    });
  });
}

export const base64Regex = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
export function decodeBase64Image(dataString: string) {
  let matches = dataString.match(base64Regex);
  let response: { image_type: string, image_data: Buffer } = {
    image_data: Buffer.from(''),
    image_type: '',
  };

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 input string');
  }

  response.image_type = matches[1];
  response.image_data = Buffer.from(matches[2], 'base64');

  if (!response.image_type || !response.image_data) {
    throw new Error(`Could not parse base64 string`);
  }

  return response;
}

export function upload_base64(base64_image: string): Promise<IUploadFile> {
  return new Promise((resolve, reject) => {
    try {
      if (!base64_image) {
        return reject({error: true, filename: undefined, image_path: undefined, message: 'no base64_image given...'});
      }
  
      const imageBuffer = decodeBase64Image(base64_image);
      const filetype = imageBuffer.image_type.split(`/`)[1];
      const filename = `${Date.now()}.${filetype}`;
      const image_path = __dirname + '/' + filename;
      console.log(`upload_base64:`, { filename, filetype, image_path });
      const writeOp = fs.writeFileSync(image_path, imageBuffer.image_data);
      console.log(`successfully uploaded base64`);
      return resolve({ error: false, filename, image_path, message: undefined });
    }
    catch (e) {
      console.log(`upload_base64 error:`, e);
      return reject({ error: true, filename: undefined, image_path: undefined, message: 'could not upload file...' });
    }
  });
}

export interface IStoreImage {
  error: boolean;
  message?: string;
  filedata: IUploadFile;
  result?: {
    public_id: string;
    secure_url: string;
  };
}

export function delete_cloudinary_image (public_id: string) {
  return new Promise((resolve, reject) => {
    console.log('deleting cloud image with public_id:', public_id);
    cloudinary.uploader.destroy(public_id, (error: any, result: any) => {
      if (error) {
        console.log('error deleting...', error);
        return reject(error);
      } else {
        console.log(
          'deleted from cloudinary successfully!',
          'public_id: ' + public_id,
          'result: ', result
        );
        return resolve(null);
      }
    });
  });
}

// export const delete_cloudinary_image = delete_cloudinary_image;

export function store_image(file: any, public_id?: string): Promise<IStoreImage> {
  return new Promise(async (resolve, reject) => {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    const oneCredentialMissing = (!cloud_name || !api_key || !api_secret);

    if (oneCredentialMissing) {
      console.log({ file, public_id, cloud_name, api_key, api_secret });
      const errorObj = {
        error: true,
        results: undefined,
        message: `One cloudinary credential is missing; upload attempt canceled.`
      };
      return reject(errorObj);
    }

    const filedata = await upload_file(file);
    if (filedata.error) {
      const errorObj = { error: filedata.error, message: filedata.message };
      return reject(errorObj);
    }

    cloudinary.config({ cloud_name, api_key, api_secret });

    if (public_id) {
      console.log('deleting cloud image with public_id:', public_id);
      cloudinary.uploader.destroy(public_id, (error: any, result: any) => {
        if (error) {
          console.log('error deleting...', error);
        } else {
          console.log(
            'deleted from cloudinary successfully!',
            'public_id: ' + public_id,
            'result: ', result
          );
        }
      });
    }

    cloudinary.uploader.upload(filedata.filename, (error: any, result: any) => {
      fs.unlink(filedata.filename, (err: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            'file deleted successfully!',
            filedata.filename
          );
        }
      });

      console.log({ error });
      return result && result.secure_url ?
        resolve({ error: false, result, filedata }) :
        reject({ error: true, result, filedata });
    });
  });
}

export function store_base64_image(base64_image: string, public_id?: string): Promise<IStoreImage> {
  return new Promise(async (resolve, reject) => {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    const oneCredentialMissing = (!cloud_name || !api_key || !api_secret);

    if (oneCredentialMissing) {
      console.log({ public_id, cloud_name, api_key, api_secret });
      const errorObj = {
        error: true,
        results: undefined,
        message: `One cloudinary credential is missing; upload attempt canceled.`
      };
      return reject(errorObj);
    }

    const filedata = await upload_base64(base64_image);
    if (filedata.error) {
      const errorObj = { error: filedata.error, message: filedata.message };
      return reject(errorObj);
    }
    
    cloudinary.config({ cloud_name, api_key, api_secret });

    if (public_id) {
      console.log('deleting cloud image with public_id:', public_id);
      cloudinary.uploader.destroy(public_id, (error: any, result: any) => {
        if (error) {
          console.log('error deleting...', error);
        } else {
          console.log(
            'deleted from cloudinary successfully!',
            'public_id: ' + public_id,
            'result: ', result
          );
        }
      });
    }

    console.log(`attempting cloud upload...`);
    cloudinary.uploader.upload(filedata.image_path, (error: any, result: any) => {
      fs.unlink(filedata.image_path, (err: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            'file deleted successfully!',
            filedata.filename
          );
        }
      });

      console.log({ error });
      return result && result.secure_url ?
        resolve({ error: false, result, filedata }) :
        reject({ error: true, result, filedata });
    });
  });
}
