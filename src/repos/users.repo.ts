import { fn, Op, WhereOptions } from "sequelize";
import {
  IUser,
  IUserExpoDevice,
  IMyModel,
  IApiKey,
  IResetPasswordRequest,
  IUserNewListingsAlert,
  IUserStripeIdentityVerificationSession,
} from "../interfaces/carry.interface";
import { PlainObject } from "../interfaces/common.interface";
import {
  Users,
  ResetPasswordRequests,
  UserExpoDevices,
  ApiKeys,
  UserNewListingsAlerts,
  UserStripeIdentityVerificationSessions,
} from "../models/delivery.model";
import { user_attrs_slim } from "../utils/constants.utils";
import {
  convertModelCurry,
  convertModelsCurry,
  convertModel,
  create_model_crud_repo_from_model_class,
} from "../utils/helpers.utils";




const users_crud = create_model_crud_repo_from_model_class<IUser>(Users);
const user_password_reset_request_crud = create_model_crud_repo_from_model_class<IResetPasswordRequest>(ResetPasswordRequests);
const user_new_listings_alerts_crud = create_model_crud_repo_from_model_class<IUserNewListingsAlert>(UserNewListingsAlerts);
const user_stripe_identity_verification_session_crud = create_model_crud_repo_from_model_class<IUserStripeIdentityVerificationSession>(UserStripeIdentityVerificationSessions);


const convertUserModel = convertModelCurry<IUser>();
const convertUserModels = convertModelsCurry<IUser>();

const convertUserExpoDeviceModel = convertModelCurry<IUserExpoDevice>();
const convertUserExpoDeviceModels = convertModelsCurry<IUserExpoDevice>();



export async function get_user_by_where(
  whereClause: WhereOptions
) {
  const user_model = await Users.findOne({
    where: whereClause,
    attributes: user_attrs_slim
  })
  .then(convertUserModel);
  return user_model;
}

export function get_user_by_username_or_email(email_or_username: string) {
  return Users.findOne({
    where: {
      [Op.or]: [
        { email: email_or_username },
        { username: email_or_username }
      ]
    }
  });
}

export async function create_user(
  params: {
    firstname: string;
    middlename?: string | null;
    lastname: string;
    // gender?: number;
    username: string;
    displayname: string;
    email: string;
    password: string;
  }
) {
  const new_user_model = await Users.create(<any> params);
  const user = await get_user_by_id(new_user_model.get('id'));
  return user!;
}

export async function get_random_users(
  limit: number
) {
  const users = await Users.findAll({
    limit,
    order: [fn( 'RANDOM' )],
    include: [{
      model: UserExpoDevices,
      as: `expo_devices`,
    }],
    attributes: [
      'id',
      'firstname',
      'lastname',
      'username',
      'icon_link',
      'uuid',
      'created_at',
      'updated_at',
      'deleted_at',
    ]
  })
  .then(convertUserModels);
  return users;
}

export async function get_user_by_email(
  email: string
) {
  try {
    const userModel = await Users.findOne({
      where: { email },
      attributes: user_attrs_slim
    })
    .then(convertUserModel);
    return userModel;
  } catch (e) {
    console.log(`get_user_by_email error - `, e);
    return null;
  }
}

export async function get_user_by_paypal(
  paypal: string
) {
  try {
    const userModel = await Users.findOne({
      where: { paypal },
      attributes: user_attrs_slim
    })
    .then(convertUserModel);
    return userModel;
  } catch (e) {
    console.log(`get_user_by_paypal error - `, e);
    return null;
  }
}

export async function get_user_by_phone(
  phone: string
) {
  try {
    const userModel = await Users.findOne({
      where: { phone },
      attributes: user_attrs_slim,
      include: [{
        model: UserExpoDevices,
        as: `expo_devices`,
      }],
    })
    .then(convertUserModel);
    return userModel;
  } catch (e) {
    console.log(`get_user_by_phone error - `, e);
    return null;
  }
}

export function update_user_by_id(id: number, updatesObj: any) {
  return users_crud.updateById(id, updatesObj);
}

export async function get_user_by_temp_phone(
  temp_phone: string
) {
  try {
    const userModel = await Users.findOne({
      where: { temp_phone },
      attributes: user_attrs_slim,
      include: [{
        model: UserExpoDevices,
        as: `expo_devices`,
      }],
    })
    .then(convertUserModel);
    return userModel;
  } catch (e) {
    console.log(`get_user_by_temp_phone error - `, e);
    return null;
  }
}



export async function get_user_by_id(id: number) {
  console.log(`get_user_by_id:`, { id });
  const user_model = await Users.findOne({
    where: { id },
    include: [{
      model: UserExpoDevices,
      as: `expo_devices`,
    }],
    attributes: {
      exclude: ['password']
    }
  })
  .then(convertUserModel);
  return user_model;
}

export async function get_user_by_stripe_customer_account_id(stripe_customer_account_id: string) {
  const user_model = await Users.findOne({
    where: { stripe_customer_account_id },
    include: [{
      model: UserExpoDevices,
      as: `expo_devices`,
    }],
    attributes: user_attrs_slim
  })
  .then(convertUserModel)
  .catch((err) => {
    console.log(`could not get user by stripe_customer_account_id`, { stripe_customer_account_id }, err);
    throw err;
  })
  return user_model;
}

export async function get_user_by_stripe_connected_account_id(stripe_account_id: string) {
  const user_model = await Users.findOne({
    where: { stripe_account_id },
    include: [{
      model: UserExpoDevices,
      as: `expo_devices`,
    }],
    attributes: user_attrs_slim
  })
  .then(convertUserModel)
  .catch((err) => {
    console.log(`could not get user by stripe_account_id`, { stripe_account_id }, err);
    throw err;
  })
  return user_model;
}

export async function get_user_by_username(
  username: string
) {
  const user_model = await Users.findOne({
    where: { username },
    attributes: { exclude: ['password'] },
    include: [{
      model: UserExpoDevices,
      as: `expo_devices`,
    }],
  })
  .then(convertUserModel);
  return user_model;
}

export async function get_user_by_uuid(
  uuid: string
) {
  try {
    const user_model = await Users.findOne({
      where: { uuid },
      attributes: { exclude: ['password'] },
      include: [{
        model: UserExpoDevices,
        as: `expo_devices`,
      }],
    })
    .then(convertUserModel);
    return user_model;
  } catch (e) {
    console.log({
      errorMessage: `get_user_by_uuid error - `,
      e,
      uuid
    });
    return null;
  }
}

export async function update_user(
  newState: Partial<{
    email: string;
    paypal: string;
    username: string;
    phone: string | null;
    temp_phone: string | null;
    bio: string;
    location: string;
    password: string;
    icon_link: string;
    icon_id: string;
    wallpaper_link: string;
    wallpaper_id: string;
    email_verified: boolean;
    phone_verified: boolean;
    stripe_account_verified: boolean;
    stripe_account_id: string;
    stripe_customer_account_id: string;
    platform_subscription_id: string,
  }>,
  whereClause: WhereOptions
) {
  try {
    const user_model_update = await Users.update(
      newState as any,
      { where: whereClause }
    );
    return user_model_update;
  } catch (e) {
    console.log({
      errorMessage: `update_user error - `,
      e,
      newState,
      whereClause
    });
    throw e;
  }
}

export function get_api_key(key: string) {
  return ApiKeys.findOne({
    where: { key },
    include: [{
      model: Users,
      as: 'user',
      attributes: user_attrs_slim
    }]
  })
  .then((model: IMyModel | null) => convertModel<IApiKey>(model));
}

export function get_user_api_key(user_id: number) {
  return ApiKeys.findOne({
    where: { user_id },
    include: [{
      model: Users,
      as: 'user',
      attributes: user_attrs_slim
    }]
  })
  .then((model: IMyModel | null) => convertModel<IApiKey>(model));
}

export async function create_user_api_key(params: {
  user_id:             number,
  firstname:           string,
  middlename:          string,
  lastname:            string,
  email:               string,
  phone:               string,
  website:             string,
  subscription_plan:   string,
}) {
  const new_key = await ApiKeys.create(params).then((model: IMyModel | null) => convertModel<IApiKey>(model));
  return new_key!;
}


export function get_user_expo_device_by_token(token: string) {
  return UserExpoDevices.findOne({
    where: { token,  }
  })
  .then(convertUserExpoDeviceModel);
}

export function get_user_expo_devices(user_id: number) {
  return UserExpoDevices.findAll({
    where: { user_id }
  })
  .then(convertUserExpoDeviceModels);
}

export function register_expo_device_and_push_token(user_id: number, token: string, device_info: PlainObject | null = null) {
  const params = {
    user_id,
    token,
    device_info: device_info && JSON.stringify(device_info)
  };
  console.log(`register_expo_device_and_push_token:`, { params });
  return UserExpoDevices.create(params)
  .then((model) => convertUserExpoDeviceModel(model)!);
}

export function remove_expo_device_from_user(token: string) {
  return UserExpoDevices.destroy({
    where: {
      token,
    }
  });
}

export function remove_expo_device_and_push_token(user_id: number, token: string) {
  return UserExpoDevices.destroy({
    where: {
      user_id,
      token,
    }
  });
}

export function check_user_active_password_reset(user_id: number) {
  return user_password_reset_request_crud.findOne({
    where: {
      user_id,
      completed: false,
    } 
  });
}

export function create_user_active_password_reset(user_id: number) {
  return user_password_reset_request_crud.create({ user_id });
}

export function get_password_reset_request_by_code(uuid: string) {
  return user_password_reset_request_crud.findOne({ where: { uuid } });
}

export function mark_password_reset_request_completed(id: number) {
  return user_password_reset_request_crud.updateById(id, { completed: true });
}



export function get_user_new_listings_alerts_by_where(where: any) {
  return user_new_listings_alerts_crud.findAll({ where });
}

export function get_user_new_listings_alerts_by_id(id: number) {
  return user_new_listings_alerts_crud.findOne({ where: { id } });
}

export function get_user_new_listings_alerts_by_id_and_user_id(id: number, user_id: number) {
  return user_new_listings_alerts_crud.findOne({ where: { id, user_id } });
}

export function create_user_new_listings_alert(params: {
  user_id: number,
  label: string
  to_city: string,
  to_state: string,
  from_city: string,
  from_state: string,
}) {
  return user_new_listings_alerts_crud.create(params);
}

export function delete_user_new_listings_alert(id: number) {
  return user_new_listings_alerts_crud.deleteById(id);
}

export function check_user_new_listings_alert(params: {
  user_id: number,
  to_city: string,
  to_state: string,
  from_city: string,
  from_state: string,
}) {
  return user_new_listings_alerts_crud.findOne({
    where: {
      user_id: params.user_id,
      from_city: { [Op.like]: `%${params.from_city}%` },
      from_state: { [Op.like]: `%${params.from_state}%` },
      to_city: { [Op.like]: `%${params.to_city}%` },
      to_state: { [Op.like]: `%${params.to_state}%` },
    }
  });
}

export function get_user_new_listings_alerts_all(user_id: number) {
  return user_new_listings_alerts_crud.findAll({
    where: { user_id },
    order: [['id', 'DESC']]
  });
}

export function get_user_new_listings_alerts(user_id: number, listing_alert_id?: number) {
  return user_new_listings_alerts_crud.paginate({
    user_id_field: 'user_id',
    user_id,
    min_id: listing_alert_id,
    orderBy: [['id', 'DESC']]
  });
}



export function check_user_stripe_identity_verification_session(user_id: number) {
  return user_stripe_identity_verification_session_crud.findOne({ where: { user_id, verified: false } });
}

export function create_user_stripe_identity_verification_session(params: {
  user_id:                     number,
  verification_session_id:     string,
}) {
  return user_stripe_identity_verification_session_crud.create(params);
}

export function verify_user_stripe_identity_verification_session_by_session_id(verification_session_id: string) {
  return user_stripe_identity_verification_session_crud.update({ verified: true }, { where: { verification_session_id } });
}

export function delete_user_stripe_identity_verification_session_by_session_id(verification_session_id: string) {
  return user_stripe_identity_verification_session_crud.destroy({ where: { verification_session_id } });
}