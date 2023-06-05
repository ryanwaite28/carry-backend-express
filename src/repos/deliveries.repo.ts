import {
  fn,
  Op,
  WhereOptions,
  FindOptions,
  Includeable,
  Model,
  FindAttributeOptions,
  GroupOption,
  Order,
  col,
  cast,
} from "sequelize";
import { STATUSES } from "../enums/common.enum";
import { PlainObject } from "../interfaces/common.interface";
import { delete_cloud_image, delete_cloudinary_image } from "../utils/cloudinary-manager.utils";
import { DeliveryDisputeSettlementOfferStatus } from "../enums/carry.enum";
import { IMyModel } from "../interfaces/carry.interface";
import {
  ICreateDeliveryProps,
  ICreateDeliveryTrackingUpdateProps,
  ICarryUserRating,
  IDelivery,
  IDeliveryDispute,
  IDeliveryDisputeCustomerSupportMessage,
  IDeliveryDisputeLog,
  IDeliveryDisputeSettlementInvoice,
  IDeliveryDisputeSettlementOffer,
  IDeliveryMessage,
  IDeliveryTrackingUpdate,
  IDeliveryUnpaidListing,
  IDeliveryCarrierTrackLocationUpdate,
  IDeliveryCarrierRequest,
} from "../interfaces/deliverme.interface";
import {
  DeliveryTrackingUpdates,
  Users,
  DeliveryDisputes,
  DeliveryCarrierTrackLocationRequests,
  DeliveryCarrierTrackLocationUpdates,
  DeliveryMessages,
  CarryAdmins,
  DeliveryDisputeLogs,
  DeliveryDisputeSettlementOffers,
  DeliveryDisputeSettlementInvoices,
  Delivery,
  DeliveryDisputeCustomerSupportMessages,
  CarryUserProfileSettings,
  // CarryUserRatings,
  CarryUserCustomerRatings,
  CarryUserCarrierRatings,
  DeliveryInsurances,
  DeliveryUnpaidListings,
  DeliveryCarrierRequests,
} from "../models/delivery.model";
import { delivery_search_attrs } from "../utils/carry.chamber";
import { user_attrs_slim } from "../utils/constants.utils";
import {
  convertModelCurry,
  convertModelsCurry,
  convertModels,
  convertModel,
  create_model_crud_repo_from_model_class,
} from "../utils/helpers.utils";
import { getAll, paginateTable } from "./_common.repo";




const delivery_crud = create_model_crud_repo_from_model_class<IDelivery>(Delivery);
const delivery_unpaid_listings_crud = create_model_crud_repo_from_model_class<IDeliveryUnpaidListing>(DeliveryUnpaidListings);
const customer_ratings_crud = create_model_crud_repo_from_model_class<ICarryUserRating>(CarryUserCustomerRatings);
const carrier_ratings_crud = create_model_crud_repo_from_model_class<ICarryUserRating>(CarryUserCarrierRatings);

const delivery_tracking_location_updates_crud = create_model_crud_repo_from_model_class<IDeliveryCarrierTrackLocationUpdate>(DeliveryTrackingUpdates);
const delivery_carrier_requests_crud = create_model_crud_repo_from_model_class<IDeliveryCarrierRequest>(DeliveryCarrierRequests);



export const deliveryOrderBy: Order = [
  ['id', 'DESC']
];

export const deliveryTrackingOrderBy: Order = [
  [DeliveryTrackingUpdates, 'id', 'DESC']
];

const convertDeliveryModel = convertModelCurry<IDelivery>();
const convertDeliveryModels = convertModelsCurry<IDelivery>();

export const deliveryCarrierRequestIncludes = [
  { model: Users, as: 'carrier', attributes: user_attrs_slim },
  { model: Delivery, as: 'delivery', include: [{ model: Users, as: 'owner', attributes: user_attrs_slim }] },
];

export const deliveryGeneralIncludes: Includeable[] = [{
  model: Users,
  as: 'owner',
  attributes: user_attrs_slim,
}, {
  model: Users,
  as: 'carrier',
  attributes: user_attrs_slim,
}];

export const deliveryRatingsInclude: Includeable[] = [{
  model: Users,
  as: 'user',
  attributes: user_attrs_slim,
}, {
  model: Users,
  as: 'writer',
  attributes: user_attrs_slim,
}];

export const deliveryMasterIncludes: Includeable[] = [
  {
    model: Users,
    as: 'owner',
    attributes: user_attrs_slim,
    include: [
      {
        model: CarryUserProfileSettings,
        as: 'carry_settings',
      }
    ]
  }, 
  {
    model: Users,
    as: 'carrier',
    attributes: user_attrs_slim,
    include: [
      {
        model: CarryUserProfileSettings,
        as: 'carry_settings',
      }
    ]
  }, 
  {
    model: DeliveryTrackingUpdates,
    as: 'deliverme_delivery_tracking_updates',
    include: [
      {
        model: Users,
        as: 'user',
        attributes: user_attrs_slim
      }
    ]
  },
  {
    model: DeliveryDisputes,
    as: `delivery_dispute`,
    // include: 
  },
  {
    model: DeliveryInsurances,
    as: `delivery_insurance`,
  },
  {
    model: DeliveryCarrierTrackLocationRequests,
    as: `delivery_carrier_track_location_requests`,
  },
  {
    model: CarryUserCustomerRatings,
    as: `customer_rating`,
    // include: deliveryRatingsInclude
  },
  {
    model: CarryUserCarrierRatings,
    as: `carrier_rating`,
    // include: deliveryRatingsInclude
  },
  {
    model: DeliveryCarrierTrackLocationUpdates,
    as: `carrier_location_updates`,
  },
  {
    model: DeliveryCarrierRequests,
    as: 'carrier_requests',
    include: [
      {
        model: Users,
        as: 'carrier',
        attributes: user_attrs_slim
      }
    ]
  },
  {
    model: DeliveryMessages,
    as: 'delivery_messages',
    include: [
      {
        model: Users,
        as: 'user',
        attributes: user_attrs_slim
      }
    ]
  },
  {
    model: DeliveryUnpaidListings,
    as: 'delivery_unpaid_listing',
    include: [
      {
        model: Users,
        as: `customer`,
        attributes: user_attrs_slim,
      }
    ]
  },
];



export const deliveryDisputeMasterIncludes: Includeable[] = [
  {
    model: Users,
    as: `creator`,
    attributes: user_attrs_slim,
  },
  {
    model: Users,
    as: `user`,
    attributes: user_attrs_slim,
  },
  {
    model: Delivery,
    as: `delivery`,
  },
  {
    model: CarryAdmins,
    as: `agent`,
    attributes: { exclude: ['password'] }
  },
  {
    model: DeliveryDisputeLogs,
    as: `delivery_dispute_logs`,
    include: [
      {
        model: Users,
        as: `creator`,
        attributes: user_attrs_slim,
      },
      {
        model: Users,
        as: `user`,
        attributes: user_attrs_slim,
      },
    ]
  },
  // {
  //   model: DeliveryDisputeCustomerSupportMessages,
  //   as: `delivery_dispute_customer_service_messagess`,
  //   include: [
  //     {
  //       model: Users,
  //       as: `user`,
  //       attributes: user_attrs_slim,
  //     },
  //   ]
  // },
  
  {
    model: DeliveryDisputeSettlementOffers,
    as: `delivery_dispute_settlement_offers`,
    include: [
      {
        model: Users,
        as: `creator`,
        attributes: user_attrs_slim,
      },
      {
        model: Users,
        as: `user`,
        attributes: user_attrs_slim,
      },
      {
        model: CarryAdmins,
        as: `agent`,
        attributes: { exclude: ['password'] }
      },
    ]
  },
  {
    model: DeliveryDisputeSettlementInvoices,
    as: `delivery_dispute_settlement_invoices`,
    include: [
      {
        model: Users,
        as: `user`,
        attributes: user_attrs_slim,
      },
      {
        model: CarryAdmins,
        as: `agent`,
        attributes: { exclude: ['password'] }
      },
    ]
  },
];

export const deliveryDisputeSlimIncludes: Includeable[] = [
  {
    model: Users,
    as: `creator`,
    attributes: user_attrs_slim,
  },
  {
    model: Users,
    as: `user`,
    attributes: user_attrs_slim,
  },
];




// Repo Functions

export async function reset_delivery(delivery: IDelivery) {
  // when carrier unassigns or returns delivery

  const delivery_id: number = delivery.id;

  if (delivery.from_person_id_image_id) {
    delete_cloud_image(delivery.from_person_id_image_id);
  }
  if (delivery.from_person_sig_image_id) {
    delete_cloud_image(delivery.from_person_sig_image_id);
  }
  if (delivery.to_person_id_image_id) {
    delete_cloud_image(delivery.to_person_id_image_id);
  }
  if (delivery.to_person_sig_image_id) {
    delete_cloud_image(delivery.to_person_sig_image_id);
  }

  const updatesobj: PlainObject = {};

  updatesobj.from_person_id_image_link = null;
  updatesobj.from_person_id_image_id = null;
  updatesobj.from_person_sig_image_link = null;
  updatesobj.from_person_sig_image_id = null;

  updatesobj.to_person_id_image_link = null;
  updatesobj.to_person_id_image_id = null;
  updatesobj.to_person_sig_image_link = null;
  updatesobj.to_person_sig_image_id = null;

  updatesobj.carrier_id = null;
  updatesobj.carrier_assigned_date = null;
  updatesobj.datetime_picked_up = null;
  updatesobj.datetime_delivered = null;
  updatesobj.datetime_completed = null;
  
  const updates = await update_delivery(delivery_id, updatesobj);

  const trackingDeletes = await DeliveryTrackingUpdates.destroy({
    where: { delivery_id },
  });
  const messagesDeletes = await DeliveryMessages.destroy({
    where: { delivery_id },
  });
  const carrierTrackLocationRequestDeletes = await DeliveryCarrierTrackLocationRequests.destroy({
    where: { delivery_id },
  });
  const carrierTrackLocationUpdateDeletes = await DeliveryCarrierTrackLocationUpdates.destroy({
    where: { delivery_id },
  });
  
  return updates;
}


export function exists_delivery_by_id(id: number) {
  return delivery_crud.findOne({
    where: { id },
    include: deliveryMasterIncludes,
    attributes: ['id']
    // order: deliveryTrackingOrderBy,
  })
  .then((result) => !!result);
}

export function get_delivery_by_id(id: number) {
  return delivery_crud.findOne({
    where: { id },
    include: deliveryMasterIncludes,
    // order: deliveryTrackingOrderBy,
  });
}

export function get_delivery_by_payment_intent_id(payment_intent_id: string, slim: boolean = false) {
  return delivery_crud.findOne({
    where: { payment_intent_id },
    include: slim ? [] : deliveryMasterIncludes,
    // order: deliveryTrackingOrderBy,
  });
}

export function get_delivery_slim_by_id(id: number) {
  return delivery_crud.findOne({
    where: { id },
    include: deliveryGeneralIncludes,
    // order: deliveryTrackingOrderBy,
  });
}

export function create_delivery(
  createObj: ICreateDeliveryProps,
  insured_amount?: number
) {
  return Delivery.create(<any> createObj, {
    include: deliveryMasterIncludes,
  })
  .then(async (model) => {
    if (insured_amount) {
      await DeliveryInsurances.create({
        delivery_id: model.dataValues.id,
        amount_paid: insured_amount
      });
    }

    return get_delivery_by_id(model.dataValues.id);
  });
}

export async function update_delivery(
  id: number, 
  updateObj: Partial<ICreateDeliveryProps>
): Promise<{updates: number, delivery: IDelivery}> {
  const updates = await Delivery.update(<any> updateObj, { where: { id } });
  const delivery = await get_delivery_by_id(id);
  const data = {
    updates: updates[0],
    delivery: delivery!
  };

  return Promise.resolve(data);
}

export function delete_delivery(id: number) {
  return Delivery.destroy({ where: { id } });
}

export function find_available_delivery_by_from_city_and_state(
  city: string, 
  state: string
) {
  return delivery_crud.findOne({
    where: {
      carrier_id: null,
      completed: false,
      from_city: city,
      from_state: state,
    },
    order: [fn('RANDOM')],
    include: deliveryMasterIncludes,
  });
}

export function find_available_delivery_by_to_city_and_state(
  city: string, 
  state: string
) {
  return delivery_crud.findOne({
    where: {
      carrier_id: null,
      completed: false,
      to_city: city,
      to_state: state,
    },
    order: [fn('RANDOM')],
    include: deliveryMasterIncludes
  });
}

export async function find_available_delivery(params: {
  you_id: number,
  where: {
    from_city?: string,
    from_state?: string,
    to_city?: string,
    to_state?: string,
  }
}) {
  const useWhere: any = {
    owner_id: {
      [Op.ne]: params.you_id
    },
    carrier_id: null,
    completed: false,
  };
  for (const key of Object.keys(params.where)) {
    if (params.where.hasOwnProperty(key) && !!(<PlainObject> params.where)[key]) {
      useWhere[key] = (<PlainObject> params.where)[key];
    }
  }

  const delivery = await delivery_crud.findOne({
    where: useWhere,
    order: [fn('RANDOM')],
    include: deliveryMasterIncludes
  });

  return delivery;
}

export async function search_deliveries(params: {
  you_id: number,
  from_city: string,
  from_state: string,
  to_city: string,
  to_state: string,
}) {
  const {
    you_id,
    from_city,
    from_state,
    to_city,
    to_state,
  } = params;

  const fromValid = from_city && from_state;
  const toValid = to_city && to_state;
  const fromAndToValid = fromValid && toValid;

  let results: IMyModel[] | undefined;

  if (!fromValid && !toValid) {
    results = await Delivery.findAll({
      where: { completed: false, carrier_id: null, owner_id: { [Op.ne]: you_id } },
      attributes: delivery_search_attrs,
      limit: 5,
      order: [fn('RANDOM')]
    });
  }
  else if (fromValid && !toValid) {
    results = await Delivery.findAll({
      where: { from_city, from_state, completed: false, carrier_id: null, owner_id: { [Op.ne]: you_id } },
      attributes: delivery_search_attrs,
      limit: 5,
      order: [fn('RANDOM')]
    });
  }
  else if (!fromValid && toValid) {
    results = await Delivery.findAll({
      where: { to_city, to_state, completed: false, carrier_id: null, owner_id: { [Op.ne]: you_id } },
      attributes: delivery_search_attrs,
      limit: 5,
      order: [fn('RANDOM')]
    });
  }
  else if (fromAndToValid) {
    results = await Delivery.findAll({
      where: { from_city, from_state, to_city, to_state, completed: false, carrier_id: null, owner_id: { [Op.ne]: you_id } },
      attributes: delivery_search_attrs,
      limit: 5,
      order: [fn('RANDOM')]
    });
  }

  return results
    ? results.map((model) => model.toJSON() as IDelivery)
    : [];
}

export function get_delivery_tracking_updates(
  delivery_id: number
) {
  return DeliveryTrackingUpdates.findAll({
    where: { delivery_id },
    include: []
  })
  .then((models: IMyModel[]) => convertModels<IDeliveryTrackingUpdate>(models));
}

export async function get_delivery_tracking_update_by_id(
  id: number
) {
  return DeliveryTrackingUpdates.findOne({
    where: { id, deleted_at: null },
    include: []
  })
  .then((model: IMyModel | null) => convertModel<IDeliveryTrackingUpdate>(model));
}

export function create_delivery_tracking_update(
  createObj: ICreateDeliveryTrackingUpdateProps
) {
  return DeliveryTrackingUpdates.create(<any> createObj)
    .then((model: IMyModel) => convertModel<IDeliveryTrackingUpdate>(model)!);
}

export function browse_recent_deliveries(
  you_id?: number,
  delivery_id?: number
) {
  const useWhere: any = {
    completed: false,
    carrier_id: null,
  };
  if (you_id) {
    useWhere.owner_id = { [Op.ne]: you_id };
  }
  if (delivery_id) {
    useWhere.delivery_id = { [Op.lt]: delivery_id };
  }

  const findQuery = {
    where: useWhere,
    include: deliveryGeneralIncludes,
    // order: deliveryTrackingOrderBy,
    limit: 10,
  };

  return delivery_crud.findAll(findQuery);
}

export function browse_featured_deliveries(
  you_id?: number,
  delivery_id?: number
) {
  const useWhere: any = {
    completed: false,
    carrier_id: null,
  };
  if (you_id) {
    useWhere.owner_id = { [Op.ne]: you_id };
  }
  if (delivery_id) {
    useWhere.delivery_id = { [Op.lt]: delivery_id };
  }

  const findQuery = {
    where: useWhere,
    // include: deliveryMasterIncludes,
    // order: deliveryTrackingOrderBy,
    limit: 5,
  };

  return delivery_crud.findAll(findQuery);
}

export function browse_map_deliveries(params: {
  you_id: number,
  swLat: number,
  swLng: number,
  neLat: number,
  neLng: number,
}) {
  // https://stackoverflow.com/questions/4834772/get-all-records-from-mysql-database-that-are-within-google-maps-getbounds
  // swlat, swlng, nelat, nelng = a, b, c, d.

  const useLatBetween = params.swLat < params.neLat
    // ? [params.swLat, params.neLat]
    ? { [Op.gt]: params.swLat, [Op.lt]: params.neLat }
    // : [params.neLat, params.swLat];
    : { [Op.gt]: params.neLat, [Op.lt]: params.swLat };

  const useLngBetween = params.swLng < params.neLng
    // ? [params.swLng, params.neLng]
    ? { [Op.gt]: params.swLng, [Op.lt]: params.neLng }
    // : [params.neLng, params.swLng];
    : { [Op.gt]: params.neLng, [Op.lt]: params.swLng };

  const useWhere: any = {
    completed: false,
    carrier_id: null,
  };
  useWhere.from_lat = useLatBetween;
  useWhere.from_lng = useLngBetween;

  if (params.you_id) {
    useWhere.owner_id = { [Op.ne]: params.you_id };
    // useWhere[Op.or] = [{ carrier_id: null }, { carrier_id: {[Op.ne]: params.you_id} }];
  } else {
    // useWhere.carrier_id = null;
  }

  console.log({ params, useWhere }); 

  const findQuery = {
    where: useWhere,
    include: deliveryMasterIncludes,
    // order: deliveryTrackingOrderBy,
  };

  return Delivery.findAll(findQuery).then(convertDeliveryModels);
}

export function create_delivery_message(params: {
  body: string,
  delivery_id: number,
  user_id: number
}) {
  return DeliveryMessages.create(params)
    .then((new_model: IMyModel) => {
      return DeliveryMessages.findOne({
        where: { id: new_model.get('id') },
        include: [{
          model: Users,
          as: 'user',
          attributes: user_attrs_slim
        }]
      })
      .then((model: IMyModel | null) => {
        return convertModel<IDeliveryMessage>(model)!
      });
    });
}


export function get_user_deliveries_count(user_id: number) {
  return Delivery.count({
    where: { owner_id: user_id }
  });
}

export function get_user_delivering_completed_count(user_id: number) {
  return Delivery.count({
    where: { carrier_id: user_id, completed: true }
  });
}

export function get_user_delivering_inprogress_count(user_id: number) {
  return Delivery.count({
    where: { carrier_id: user_id, completed: false }
  });
}

export function get_delivery_carrier_location_request_pending(delivery_id: number) {
  return DeliveryCarrierTrackLocationRequests.findOne({
    where: {
      delivery_id,
      status: STATUSES.PENDING,
    }
  });
}

export function create_delivery_carrier_location_request(delivery_id: number) {
  return DeliveryCarrierTrackLocationRequests.create({
    delivery_id,
    status: STATUSES.PENDING,
  });
}



export function set_delivery_carrier_location_requested(id: number, carrier_location_requested: boolean) {
  return Delivery.update(
    { carrier_location_requested },
    { where: { id } }
  ).then((results) => {
    console.log({ results });
    return results;
  });
}

export function set_delivery_carrier_shared_location(id: number, carrier_shared_location: boolean) {
  if (!carrier_shared_location) {
    return Delivery.update(
      { carrier_shared_location, carrier_location_request_completed: true, carrier_latest_lat: null, carrier_latest_lng: null },
      { where: { id } }
    ).then((results) => {
      console.log({ results });
      return results;
    });
  }

  return Delivery.update(
    { carrier_shared_location, carrier_location_request_completed: true },
    { where: { id } }
  ).then((results) => {
    console.log({ results });
    return results;
  });
}

export function set_delivery_carrier_lat_lng_location(params: {
  id: number,
  carrier_latest_lat: number | null,
  carrier_latest_lng: number | null,
}) {
  const { id, carrier_latest_lat, carrier_latest_lng } = params;

  return Delivery.update(
    { carrier_latest_lat, carrier_latest_lng },
    { where: { id } }
  ).then((results) => {
    console.log({ results });
    return results;
  });
}

export function create_delivery_carrier_lat_lng_location_update(params: {
  delivery_id: number,
  lat: number,
  lng: number,
}) {
  const { delivery_id, lat, lng } = params;

  return DeliveryCarrierTrackLocationUpdates.create({
    delivery_id,
    lat, 
    lng,
  });
}





export function leave_delivery_customer_review(params: {
  user_id: number,
  writer_id: number,
  delivery_id: number,
  rating: number,
  title: string,
  summary: string,
  image_link?: string,
  image_id?: string,
}) {
  return customer_ratings_crud.create(params)
    .then((model) => {
      return customer_ratings_crud.findById(model.id, { include: deliveryRatingsInclude });
    });
}


export function leave_delivery_carrier_review(params: {
  user_id: number,
  writer_id: number,
  delivery_id: number,
  rating: number,
  title: string,
  summary: string,
  image_link?: string,
  image_id?: string,
}) {
  return carrier_ratings_crud.create(params)
    .then((model) => {
      return carrier_ratings_crud.findById(model.id, { include: deliveryRatingsInclude });
    });
}






export function get_user_deliveries_all(user_id: number) {
  return getAll(
    Delivery,
    "owner_id",
    user_id,
    deliveryMasterIncludes,
    undefined,
    undefined,
    undefined,
    deliveryOrderBy
  )
  .then(convertDeliveryModels);
}

export async function get_user_deliveries(user_id: number, delivery_id?: number) {
  return delivery_crud.paginate({
    user_id_field: 'owner_id',
    user_id,
    min_id: delivery_id,
    include: deliveryMasterIncludes,
    orderBy: deliveryOrderBy
  });
}

export async function get_user_deliverings_all(user_id: number) {
  return getAll(
    Delivery,
    "carrier_id",
    user_id,
    deliveryMasterIncludes,
    undefined,
    undefined,
    { completed: true },
    deliveryOrderBy
  )
  .then(convertDeliveryModels);
}

export async function get_user_deliverings(user_id: number, delivery_id?: number) {
  return delivery_crud.paginate({
    user_id_field: 'carrier_id',
    user_id,
    min_id: delivery_id,
    include: deliveryMasterIncludes,
    whereClause: { completed: true },
    orderBy: deliveryOrderBy
  });
}

export async function get_user_deliveries_all_slim(user_id: number) {
  return getAll(
    Delivery,
    "owner_id",
    user_id,
    deliveryGeneralIncludes,
    undefined,
    undefined,
    undefined,
    deliveryOrderBy
  )
  .then(convertDeliveryModels);
}

export async function get_user_deliveries_slim(user_id: number, delivery_id?: number) {
  return delivery_crud.paginate({
    user_id_field: 'owner_id',
    user_id,
    min_id: delivery_id,
    include: deliveryGeneralIncludes,
    orderBy: deliveryOrderBy
  });
}

export async function get_user_deliverings_all_slim(user_id: number) {
  return getAll(
    Delivery,
    "carrier_id",
    user_id,
    deliveryGeneralIncludes,
    undefined,
    undefined,
    { completed: true },
    deliveryOrderBy
  ).then(convertDeliveryModels);
}

export async function get_user_deliverings_slim(
  user_id: number,
  delivery_id?: number
) {
  return delivery_crud.paginate({
    user_id_field: 'carrier_id',
    user_id,
    min_id: delivery_id,
    include: deliveryGeneralIncludes,
    whereClause: { completed: true },
    orderBy: deliveryOrderBy
  });
}

export async function get_user_delivering(you_id: number) {
  return Delivery.findAll({
    where: {
      carrier_id: you_id,
      completed: false,
    },
    include: deliveryMasterIncludes,
    order: deliveryOrderBy,
  })
  .then(convertDeliveryModels);
}

export function get_delivery_dispute_by_id(id: number) {
  return DeliveryDisputes.findOne({
    where: { id },
    include: deliveryDisputeSlimIncludes,
  })
  .then((model) => !model ? null : model.toJSON() as IDeliveryDispute)
}

export function get_delivery_dispute_info_by_id(id: number) {
  return DeliveryDisputes.findOne({
    where: { id },
    include: deliveryDisputeMasterIncludes,
  })
  .then((model) => !model ? null : model.toJSON() as IDeliveryDispute)
}

export function get_delivery_dispute_by_delivery_id(delivery_id: number) {
  return DeliveryDisputes.findOne({
    where: { delivery_id },
    include: deliveryDisputeSlimIncludes,
  })
  .then((model) => !model ? null : model.toJSON() as IDeliveryDispute)
}

export function get_delivery_dispute_info_by_delivery_id(delivery_id: number) {
  return DeliveryDisputes.findOne({
    where: { delivery_id },
    include: deliveryDisputeMasterIncludes,
  })
  .then((model) => !model ? null : model.toJSON() as IDeliveryDispute)
}


export function create_delivery_dispute(params: {
  creator_id: number,
  user_id: number,
  delivery_id: number,
  status: string,

  title: string,
  details: string,
  image_link?: string,
  image_id?: string,
  compensation: number,
}) {
  return DeliveryDisputes.create(params)
    .then((model) => {
      return get_delivery_dispute_info_by_id(model.get(`id`));
    })
    .then((obj) => {
      return obj!;
    }); 
}

export function get_delivery_owner_by_delivery_id(delivery_id: number) {
  return delivery_crud.findOne({
    where: { id: delivery_id },
    attributes: ['id', 'owner_id'],
    include: [
      { model: Users, as: 'owner', attributes: user_attrs_slim }
    ]
  })
  .then((delivery) => {
    return delivery.owner!
  });
}

export function update_delivery_dispute(id: number, params: Partial<{
  creator_id: number,
  user_id: number,
  delivery_id: number,
  title: string,
  details: string,
  status: string,
  image_link?: string,
  image_id?: string,
  compensation: number,
}>) {
  return DeliveryDisputes.update(params, { where: { id } })
    .then((model) => {
      return get_delivery_dispute_info_by_id(id);
    })
    .then((obj) => {
      return obj!;
    }); 
}

export function create_delivery_dispute_log(params: {
  creator_id: number,
  user_id: number,
  delivery_id: number,
  dispute_id: number,
  body: string,
  image_link?: string,
  image_id?: string,
}) {
  return DeliveryDisputeLogs.create(params)
    .then((new_model) => {
      return DeliveryDisputeLogs.findOne({
        where: { id: new_model.get(`id`) },
        include: deliveryDisputeSlimIncludes
      })
      .then((model) => {
        return model!.toJSON() as IDeliveryDisputeLog
      });
    })
}

export function get_open_delivery_dispute_settlement_offer_by_dispute_id(dispute_id: number) {
  return DeliveryDisputeSettlementOffers.findOne({
    where: { dispute_id, status: DeliveryDisputeSettlementOfferStatus.PENDING },
    include: deliveryDisputeSlimIncludes
  })
  .then((model) => {
    return model?.toJSON() as IDeliveryDisputeSettlementOffer;
  });
}

export function create_delivery_dispute_settlement_offer(params: {
  dispute_id: number,
  creator_id: number,
  user_id: number,
  delivery_id: number,

  message: string,
  offer_amount: number,
  status: string,
}) {
  return DeliveryDisputeSettlementOffers.create(params)
    .then((new_model) => {
      return DeliveryDisputeSettlementOffers.findOne({
        where: { id: new_model.get(`id`) },
        include: deliveryDisputeSlimIncludes
      })
      .then((model) => {
        return model!.toJSON() as IDeliveryDisputeSettlementOffer;
      });
    })
}

export function update_delivery_dispute_settlement_offer_status(
  settlement_offer_id: number,
  status: string,
) {
  return DeliveryDisputeSettlementOffers.update(
    { status },
    { where: { id: settlement_offer_id } }
  )
  .then((updates) => {
    return DeliveryDisputeSettlementOffers.findOne({
      where: { id: settlement_offer_id },
      include: deliveryDisputeSlimIncludes
    })
    .then((model) => {
      return model!.toJSON() as IDeliveryDisputeSettlementOffer
    });
  });
}


export function create_delivery_dispute_customer_service_message(params: {
  is_from_cs: boolean,
  user_id: number,
  delivery_id: number,
  dispute_id: number,
  body: string,
  image_link?: string,
  image_id?: string,
}) {
  return DeliveryDisputeCustomerSupportMessages.create(params)
    .then((new_model) => {
      return DeliveryDisputeCustomerSupportMessages.findOne({
        where: { id: new_model.get(`id`) },
        include: [
          {
            model: Users,
            as: `user`,
            attributes: user_attrs_slim
          }
        ]
      })
      .then((model) => {
        return model!.toJSON() as IDeliveryDisputeCustomerSupportMessage;
      });
    })
}


export function get_user_dispute_messages_by_user_id_and_dispute_id(dispute_id: number, user_id: number) {
  return DeliveryDisputeCustomerSupportMessages.findAll({
    where: { dispute_id, user_id },
    include: [
      {
        model: Users,
        as: `user`,
        attributes: user_attrs_slim,
      },
      {
        model: CarryAdmins,
        as: `agent`,
        attributes: { exclude: ['password'] }
      },
    ],
    order: [['id', 'DESC']]
  })
  .then((models) => {
    return models.map((model) => model.toJSON() as IDeliveryDisputeCustomerSupportMessage) ;
  });
}

export function get_agent_dispute_messages_by_agent_id_and_dispute_id(dispute_id: number, agent_id: number) {
  return DeliveryDisputeCustomerSupportMessages.findAll({
    where: { dispute_id, agent_id },
    include: [
      {
        model: Users,
        as: `user`,
        attributes: user_attrs_slim,
      },
      {
        model: CarryAdmins,
        as: `agent`,
        attributes: { exclude: ['password'] }
      },
    ],
    order: [['id', 'DESC']]
  })
  .then((models) => {
    return models.map((model) => model.toJSON() as IDeliveryDisputeCustomerSupportMessage) ;
  });
}

export function create_delivery_dispute_settlement_invoice(params: {
  offer_id: number,
  dispute_id: number,
  user_id: number,
  delivery_id: number,
  message: string,
  invoice_amount: number,
  status: string,
  date_due: string,
}) {
  return DeliveryDisputeSettlementInvoices.create(params)
    .then((new_model) => {
      return DeliveryDisputeSettlementInvoices.findOne({
        where: { id: new_model.get(`id`) },
        include: [{
          model: Users,
          as: `user`,
          attributes: user_attrs_slim
        }]
      })
      .then((model) => {
        return model!.toJSON() as IDeliveryDisputeSettlementInvoice;
      });
    })
}

export function update_delivery_dispute_settlement_invoice(invoice_id: number, updates: Partial<{
  offer_id: number,
  dispute_id: number,
  creator_id: number,
  user_id: number,
  agent_id?: number,
  delivery_id: number,
  message: string,
  invoice_amount: number,
  status: string,
  paid: boolean,
  date_due: string,
  charge_id: string,
  payment_method_id: string,
  payment_intent_id: string,
}>) {
  return DeliveryDisputeSettlementInvoices.update(updates, { where: { id: invoice_id } })
    .then((model_updates) => {
      return DeliveryDisputeSettlementInvoices.findOne({
        where: { id:invoice_id },
        include: [{
          model: Users,
          as: `user`,
          attributes: user_attrs_slim
        }]
      })
      .then((model) => {
        return model?.toJSON() as IDeliveryDisputeSettlementInvoice;
      });
    })
}


export function create_delivery_unpaid_listing(params: {
  user_id: number,
  delivery_id: number,
  metadata?: string | null,
  canceled_payment_intent_id: string,
}) {
  return delivery_unpaid_listings_crud.create(params);
}

export function check_delivery_unpaid_listing_is_unpaid(delivery_id: number) {
  return delivery_unpaid_listings_crud.findOne({ where: { delivery_id, paid: false } });
}

export function check_user_has_unpaid_listings(user_id: number) {
  return delivery_unpaid_listings_crud.findOne({ where: { user_id, paid: false } });
}

export function create_delivery_tracking_location_update(params: {
  delivery: number,
  lat: number,
  lng: number,
}) {
  return delivery_tracking_location_updates_crud.create(params);
}

export function get_delivery_tracking_location_updates_by_delivery_id_all(delivery_id: number) {
  return delivery_tracking_location_updates_crud.findAll({ where: { delivery_id } });
}

export function clear_delivery_tracking_location_updates_by_delivery_id(delivery_id: number) {
  return delivery_tracking_location_updates_crud.destroy({ where: { delivery_id } });
}





export function get_carrier_delivery_request_by_id(id: number) {
  return delivery_carrier_requests_crud.findOne({ 
    where: { id },
    include: deliveryCarrierRequestIncludes
  });
}

export function get_carrier_requests_all(user_id: number) {
  return delivery_carrier_requests_crud.findAll({
    where: { user_id },
    include: [{ model: Delivery, as: 'delivery', include: [{ model: Users, as: 'owner', attributes: user_attrs_slim }] }],
    order: [['id', 'DESC']]
  });
}

export function get_carrier_requests_pending_all(user_id: number) {
  return delivery_carrier_requests_crud.findAll({
    where: { user_id, status: STATUSES.PENDING },
    include: [{ model: Delivery, as: 'delivery', include: [{ model: Users, as: 'owner', attributes: user_attrs_slim }] }],
    order: [['id', 'DESC']]
  });
}

export async function get_carrier_requests(user_id: number, carrier_request_id?: number) {
  return delivery_carrier_requests_crud.paginate({
    user_id_field: 'user_id',
    user_id,
    min_id: carrier_request_id,
    include: [{ model: Delivery, as: 'delivery', include: [{ model: Users, as: 'owner', attributes: user_attrs_slim }] }],
    orderBy: deliveryOrderBy
  });
}

export function get_carrier_delivery_requests_all(delivery_id: number) {
  return delivery_carrier_requests_crud.findAll({
    where: { delivery_id },
    include: deliveryCarrierRequestIncludes
  });
}

export function get_carrier_delivery_requests(delivery_id: number, carrier_request_id?: number) {
  return delivery_carrier_requests_crud.paginate({
    user_id_field: 'delivery_id',
    user_id: delivery_id,
    min_id: carrier_request_id,
    include: deliveryCarrierRequestIncludes,
    orderBy: [['id', 'DESC']]
  });
}

export function delivery_has_an_accepted_carrier_request(delivery_id: number) {
  return delivery_carrier_requests_crud.findOne({
    where: { delivery_id, status: STATUSES.ACCEPTED },
    include: deliveryCarrierRequestIncludes
  });
}

export function delivery_has_at_lease_one_pending_carrier_request(delivery_id: number) {
  return delivery_carrier_requests_crud.findOne({
    where: { delivery_id, status: STATUSES.PENDING },
    include: deliveryCarrierRequestIncludes
  });
}

export function check_carrier_delivery_request(delivery_id: number, user_id: number) {
  return delivery_carrier_requests_crud.findOne({
    where: { delivery_id, user_id },
    include: deliveryCarrierRequestIncludes
  });
}

export function check_carrier_delivery_request_pending(delivery_id: number, user_id: number) {
  return delivery_carrier_requests_crud.findOne({
    where: { delivery_id, user_id, status: STATUSES.PENDING },
    include: deliveryCarrierRequestIncludes
  });
}

export function create_carrier_delivery_request(delivery_id: number, user_id: number) {
  return delivery_carrier_requests_crud.create({ delivery_id, user_id, status: STATUSES.PENDING });
}

export function update_carrier_delivery_request_status(request_id: number, status: string) {
  return delivery_carrier_requests_crud.updateById(request_id, { status });
}

export function get_customer_ratings_stats(user_id: number) {
  return CarryUserCustomerRatings.findOne({
    where: { user_id },
    attributes: [
      [cast(fn('AVG', col('rating')), 'float'), 'ratingsAvg'],
      [cast(fn('COUNT', col('rating')), 'float'), 'ratingsCount'],
    ],
    group: ['user_id'],
  }) 
}

export function get_customer_ratings_all(user_id: number) {
  return customer_ratings_crud.findAll({
    where: { user_id },
    include: deliveryRatingsInclude
  });
}

export function get_customer_ratings(user_id: number, min_id?: number) {
  return customer_ratings_crud.paginate({
    user_id_field: 'user_id',
    user_id,
    min_id,
    include: deliveryRatingsInclude,
    orderBy: [['id', 'DESC']]
  });
}



export function get_carrier_ratings_stats(user_id: number) {
  return CarryUserCarrierRatings.findOne({
    where: { user_id },
    attributes: [
      [cast(fn('AVG', col('rating')), 'float'), 'ratingsAvg'],
      [cast(fn('COUNT', col('rating')), 'float'), 'ratingsCount'],
    ],
    group: ['user_id'],
  }) 
}

export function get_carrier_ratings_all(user_id: number) {
  return carrier_ratings_crud.findAll({
    where: { user_id },
    include: deliveryRatingsInclude
  });
}

export function get_carrier_ratings(user_id: number, min_id?: number) {
  return carrier_ratings_crud.paginate({
    user_id_field: 'user_id',
    user_id,
    min_id,
    include: deliveryRatingsInclude,
    orderBy: [['id', 'DESC']]
  });
}