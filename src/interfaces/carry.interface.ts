import {
  BuildOptions,
} from 'sequelize';
import { Model } from 'sequelize';
import { PlainObject } from './common.interface';




/**
 * @see: https://sequelize.org/master/manual/typescript
 */


/** Model Class Type */

export interface IMyModel extends Model<any> {
  readonly id: number;
  [key: string]: any;
}

export type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IMyModel;
};

export type MyModelStaticGeneric<T> = typeof Model & {
  new (values?: object, options?: BuildOptions): T;
};







export interface IUserSubscriptionInfo {
  status: string,
  active: boolean,
  current_period_start: number,
  current_period_end: number,
}

export interface ICommonModel extends PlainObject {
  id:                      number,
  date_created:            string,
  uuid:                    string,
  created_at:              string,
  updated_at:              string,
  deleted_at:              string,
}


export interface IUserExpoDevice extends ICommonModel {
  user_id:              number,
  token:                string,
  device_info:          string,
  device_id:            string,
  device_type:          string,
  device_platform:      string,
}


export interface IUser extends ICommonModel {
  gender:                      number,
  firstname:                   string,
  middlename:                  string,
  lastname:                    string,
  username:                    string,
  displayname:                 string,
  email:                       string,
  password?:                   string,
  paypal:                      string,
  paypal_verified:             boolean,
  stripe_customer_account_id:  string,
  stripe_account_id:           string,
  stripe_account_verified:     boolean,
  platform_subscription_id:    string,
  phone:                       string,
  temp_phone:                  string,
  headline:                    string,
  bio:                         string,
  tags:                        string,
  icon_link:                   string,
  icon_id:                     string,
  photo_id_link:               string,
  photo_id_id:                 string,
  wallpaper_link:              string,
  wallpaper_id:                string,
  location:                    string,
  location_id:                 string,
  location_json:               string,
  zipcode:                     string,
  city:                        string,
  state:                       string,
  county:                      string,
  country:                     string,
  lat:                         number,
  lng:                         number,
  public:                      boolean,
  online:                      boolean,
  premium:                     boolean,
  certified:                   boolean,
  person_verified:             boolean,
  email_verified:              boolean,
  phone_verified:              boolean,
  can_message:                 boolean,
  can_converse:                boolean,
  notifications_last_opened:   string,

  expo_devices?: IUserExpoDevice[],
}

export interface IUserNotificationsLastOpened extends ICommonModel {
  user_id:                             number,
  notifications_last_opened:           string,
}

export interface IUserField extends ICommonModel {
  user_id:              number,
  fieldname:            string,
  fieldtype:            string,
  fieldvalue:           string,
}

export interface IUsersEmailVerification extends ICommonModel {
  user_id:                 number,
  email:                   string,
  verification_code:       string,
  verified:                boolean,
}

export interface IUsersPhoneVerification extends ICommonModel {
  user_id:                 number,
  request_id:              string,
  phone:                   string,
  verification_code:       string,
}

export interface IResetPasswordRequest extends ICommonModel {
  user_id:             number,
  completed:           boolean,
  unique_value:        string,
}

export interface IAccountReported extends ICommonModel {
  user_id:             number,
  reporting_id:        number,
  issue_type:          string,
  details:             string,
}

export interface ISiteFeedback extends ICommonModel {
  user_id:             number,
  rating:              number,
  title:               string,
  summary:             string,
}

export interface IResetPasswordRequest extends ICommonModel {
  user_id:                 number,
  completed:               boolean,
  unique_value:            string,
}

export interface INotification extends ICommonModel {
  from_id:                 number,
  to_id:                   number,
  event:                   string,
  target_type:             string,
  target_id:               number,
  read:                    boolean,
  image_link:              string,
  image_id:                string,
  
  message?:                string,
  link?:                   string,
  [key:string]:            any;
}

export interface IUserExpoDevice extends ICommonModel {
  user_id:              number,
  token:                string,
  device_info:          string,
  device_id:            string,
  device_type:          string,
  device_platform:      string,
}

export interface IToken extends ICommonModel {
  user_id:                 number,
  device:                  string,
  token:                   string,
  ip_address:              string,
  user_agent:              string,
  date_created:            string,
  date_last_used:          string,
}

export interface IApiKey extends ICommonModel {
  user_id:             number | null,
  key:                 string,
  firstname:           string,
  middlename:          string,
  lastname:            string,
  email:               string,
  phone:               string,
  website:             string,
  subscription_plan:   string,

  user?: IUser;
}

export interface ApiKeyInvoice extends ICommonModel {
  key_id:              number,
  invoice_id:          number,
  status:              string,
}

export interface IApiKeyAllowedOrigin extends ICommonModel {
  key_id:              number,
  origin:              string,
}

export interface IApiKeyRequest extends ICommonModel {
  key_id:              number,
  request_url:         string,
  request_headers:     string,
  request_body:        string,
  resource:            string,
  response:            number,
  results:             string,
}

