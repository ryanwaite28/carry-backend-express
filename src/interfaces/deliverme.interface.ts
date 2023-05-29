import { ICommonModel, IUser } from "./carry.interface";


export interface ICreateDeliveryProps {
  owner_id: number;

  title: string;
  description: string;
  charge_id: string,
  payment_intent_id: string,
  payment_method_id: string,

  item_image_link: string;
  item_image_id: string;

  from_location: string;
  from_address: string;
  from_street: string;
  from_city: string;
  from_state: string;
  from_zipcode: number;
  from_country: string;
  from_place_id: string;
  from_lat: number;
  from_lng: number;
  from_person: string;
  from_person_phone: string;
  from_person_email: string;
  from_person_id_required: boolean;
  from_person_sig_required: boolean;

  to_location: string;
  to_address: string;
  to_street: string;
  to_city: string;
  to_state: string;
  to_zipcode: number;
  to_country: string;
  to_place_id: string;
  to_lat: number;
  to_lng: number;
  to_person: string;
  to_person_phone: string;
  to_person_email: string;
  to_person_id_required: boolean;
  to_person_sig_required: boolean;

  category: string;
  size: string;
  weight: number;
  auto_accept_anyone: boolean;
  urgent: boolean;
  payout: number;
  penalty: number;
}

export interface ICreateDeliveryTrackingUpdateProps {
  user_id: number;
  delivery_id: number;

  icon_link?: string;
  icon_id?: string;
  message: string;
  carrier_lat: number;
  carrier_lng: number;
}


export interface ICarryUserRating extends ICommonModel {
  user_id: number,
  writer_id: number,
  delivery_id: number,
  rating: number,
  title: string,
  summary: string,
  image_link: string,
  image_id: string,
}





export interface IDelivery extends ICommonModel {
  owner_id: number,
  
  carrier_id: number | null,
  carrier_assigned_date: string | null,
  
  carrier_latest_lat: number | null,
  carrier_latest_lng: number | null,
  carrier_location_requested: boolean,
  carrier_location_request_completed: boolean,
  carrier_shared_location: boolean,

  carrier_id_image_link: string | null,
  carrier_id_image_id: string | null,
  carrier_sig_image_link: string | null,
  carrier_sig_image_id: string | null,

  title: string,
  description: string,
  charge_id: string,
  payment_intent_id: string,
  payment_method_id: string,
  tags: string,
  item_image_link: string | null,
  item_image_id: string | null,
  
  from_location: string,
  from_address: string,
  from_street: string,
  from_city: string,
  from_state: string,
  from_zipcode: number,
  from_country: string,
  from_place_id: string,
  from_lat: number,
  from_lng: number,
  from_person: string,
  from_person_phone: string,
  from_person_email: string,
  from_person_id_required: boolean,
  from_person_sig_required: boolean,

  from_person_id_image_link: string | null,
  from_person_id_image_id: string | null,
  from_person_sig_image_link: string | null,
  from_person_sig_image_id: string | null,

  to_location: string,
  to_address: string,
  to_street: string,
  to_city: string,
  to_state: string,
  to_zipcode: number,
  to_country: string,
  to_place_id: string,
  to_lat: number,
  to_lng: number,
  to_person: string,
  to_person_phone: string,
  to_person_email: string,
  to_person_id_required: boolean,
  to_person_sig_required: boolean,

  to_person_id_image_link: string | null,
  to_person_id_image_id: string | null,
  to_person_sig_image_link: string | null,
  to_person_sig_image_id: string | null,

  distance_miles: number,
  
  category: string,
  size: string,
  weight: number,
  featured: string | null, // bronze/silver/gold
  available: boolean,
  started: boolean,
  auto_accept_anyone: boolean,
  urgent: boolean,
  canceled: boolean,
  returned: boolean,
  completed: boolean,
  delivered_instructions: string | null,
  delivered_image_link: string | null,
  delivered_image_id: string | null,
  payment_session_id: string | null,
  payout: number,
  payout_invoice_id: string | null, // paypal
  penalty: number,
  penalty_invoice_id: string | null, // paypal

  datetime_pick_up_by: string | null,
  datetime_picked_up: string | null,
  datetime_picked_up_est: string | null,
  
  datetime_delivered: string | null,
  datetime_deliver_by: string | null,
  datetime_delivered_est: string | null,

  datetime_completed: string | null,
  datetime_complete_by: string | null,
  datetime_complete_est: string | null,

  date_created: string,
  uuid: string,

  // includes
  owner?: ICarryUser,
  carrier?: ICarryUser,
  deliverme_delivery_tracking_updates?: IDeliveryTrackingUpdate[],
  delivery_messages?: IDeliveryMessage[],
  delivery_carrier_track_location_requests?: IDeliveryCarrierTrackLocationRequest[],
  delivery_carrier_track_location_updates?: IDeliveryCarrierTrackLocationUpdate[],

  delivery_dispute?: IDeliveryDispute,
}

export interface ICarryUser extends IUser {
  deliverme_settings?: ICarryUserSettings,
}

export interface ICarryAdmin extends ICommonModel {
  firstname: string,
  middlename: string,
  lastname: string,
  icon_link: string,
  icon_id: string,
  email: string,
  password: string,
  phone: string,
  role: string,
  active: boolean,

  delivery_assigned_disputes?: IDeliveryDispute[],
}


export interface ICarryUserSettings extends ICommonModel {
  user_id: number,
  phone: string,
  email: string,
  cashapp_tag: string,
  venmo_id: string,
  paypal_me: string,
  google_pay: string,
}

export interface IDeliveryTransaction extends ICommonModel {
  delivery_id: number,
  action_type: string,
  action_id: string,
  status: string,
}

export interface IDeliveryMessage extends ICommonModel {
  delivery_id: number,
  user_id: number,
  body: string,
  opened: boolean,
}

export interface IDeliveryPayoutAttempts extends ICommonModel {
  delivery_id: number,
  transaction_id: string,
}

export interface IDeliveryPenaltyAttempt extends ICommonModel {
  delivery_id: number,
  transaction_id: string,
}

export interface IDeliveryRequest extends ICommonModel {
  user_id: number,
  delivery_id: number,
  message: string,
}

export interface IDeliveryDispute extends ICommonModel {
  creator_id: number,
  user_id: number,
  agent_id?: number,
  delivery_id: number,
  title: string,
  details: string,
  status: string,
  image_link: string | null,
  image_id: string | null,
  compensation: number,

  agent?: ICarryAdmin,
  creator?: IUser,
  user?: IUser,
  delivery_dispute_logs?: IDeliveryDisputeLog[],
  delivery_dispute_settlement_offers?: IDeliveryDisputeSettlementOffer[],
  delivery_dispute_settlement_invloces?: IDeliveryDisputeSettlementInvoice[],
}

export interface IDeliveryDisputeLog extends ICommonModel {
  dispute_id: number,
  creator_id: number,
  user_id: number,
  agent_id?: number,
  delivery_id: number,
  body: string | null,
  image_link: string | null,
  image_id: string | null,

  creator?: IUser,
  user?: IUser,
  agent?: ICarryAdmin,
}

export interface IDeliveryDisputeCustomerSupportMessage extends ICommonModel {
  dispute_id: number,
  user_id: number,
  agent_id?: number,
  delivery_id: number,
  is_from_cs: boolean,
  body: string,
  image_link: string | null,
  image_id: string | null,

  user?: IUser,
  agent?: ICarryAdmin,
}

export interface IDeliveryDisputeSettlementOffer extends ICommonModel {
  dispute_id: number,
  creator_id: number,
  user_id: number,
  agent_id?: number,
  delivery_id: number,
  message: string,
  offer_amount: number,
  status: string,

  creator?: IUser,
  user?: IUser,
  agent?: ICarryAdmin,
}

export interface IDeliveryDisputeSettlementInvoice extends ICommonModel {
  offer_id: number,
  dispute_id: number,
  user_id: number,
  agent_id?: number,
  delivery_id: number,
  message: string,
  invoice_amount: number,
  status: string,
  paid: boolean,
  date_due: string,
  charge_id: string,
  payment_intent_id: string,
  payment_method_id: string,

  user?: IUser,
  agent?: ICarryAdmin,
}

export interface IDeliveryTrackingUpdate extends ICommonModel {
  delivery_id: number,
  user_id: number,
  message: string,
  location: string,
  carrier_lat: number,
  carrier_lng: number
  icon_link: string,
  icon_id: string,

  user?: IUser,
}

export interface IDeliveryUnpaidListing {
  id: number,
  user_id: number,
  delivery_id: number,
  paid: boolean,
  metadata: string | null,
  canceled_payment_intent_id: string,
  payment_intent_id: string | null,
  date_created: string,
  uuid: string,
}

export interface IDeliveryCarrierTrackLocationRequest extends ICommonModel {
  id: number,
  delivery_id: number,
  status: string,
}

export interface IDeliveryCarrierTrackLocationUpdate extends ICommonModel {
  id: number,
  delivery_id: number,
  lat: number,
  lng: number,
}

export interface IModelRating extends ICommonModel {
  user_id:             number,
  writer_id:           number,
  rating:              number,
  title:               string,
  summary:             string,
}
export interface IUserRating extends IModelRating {}