export enum CARRY_EVENT_TYPES {
  CARRIER_ASSIGNED = 'CARRIER_ASSIGNED',
  CARRIER_UNASSIGNED = 'CARRIER_UNASSIGNED',
  CARRIER_MARKED_AS_PICKED_UP = 'CARRIER_MARKED_AS_PICKED_UP',
  CARRIER_MARKED_AS_DROPPED_OFF = 'CARRIER_MARKED_AS_DROPPED_OFF',
  DELIVERY_NEW_TRACKING_UPDATE = 'DELIVERY_NEW_TRACKING_UPDATE',
  DELIVERY_NEW_MESSAGE = 'DELIVERY_NEW_MESSAGE',
  DELIVERY_ADD_COMPLETED_PICTURE = 'DELIVERY_ADD_COMPLETED_PICTURE',

  DELIVERY_FROM_PERSON_ID_PICTURE_ADDED = 'DELIVERY_FROM_PERSON_ID_PICTURE_ADDED',
  DELIVERY_FROM_PERSON_SIG_PICTURE_ADDED = 'DELIVERY_FROM_PERSON_SIG_PICTURE_ADDED',
  DELIVERY_TO_PERSON_ID_PICTURE_ADDED = 'DELIVERY_TO_PERSON_ID_PICTURE_ADDED',
  DELIVERY_TO_PERSON_SIG_PICTURE_ADDED = 'DELIVERY_TO_PERSON_SIG_PICTURE_ADDED',

  DELIVERY_COMPLETED = 'DELIVERY_COMPLETED',
  DELIVERY_RETURNED = 'DELIVERY_RETURNED',

  CARRIER_LOCATION_REQUESTED = 'CARRIER_LOCATION_REQUESTED',
  CARRIER_LOCATION_REQUEST_CANCELED = 'CARRIER_LOCATION_REQUEST_CANCELED',
  CARRIER_LOCATION_REQUEST_ACCEPTED = 'CARRIER_LOCATION_REQUEST_ACCEPTED',
  CARRIER_LOCATION_REQUEST_DECLINED = 'CARRIER_LOCATION_REQUEST_DECLINED',
  CARRIER_LOCATION_SHARED = 'CARRIER_LOCATION_SHARED',
  CARRIER_LOCATION_UNSHARED = 'CARRIER_LOCATION_UNSHARED',
  CARRIER_LOCATION_UPDATED = 'CARRIER_LOCATION_UPDATED',

  TO_DELIVERY = 'TO_DELIVERY',

  NEW_DELIVERY_OWNER_REVIEW = 'NEW_DELIVERY_OWNER_REVIEW',
  NEW_DELIVERY_CARRIER_REVIEW = 'NEW_DELIVERY_CARRIER_REVIEW',

  NEW_DELIVERY_DISPUTE = 'NEW_DELIVERY_DISPUTE',
  NEW_DELIVERY_DISPUTE_LOG = 'NEW_DELIVERY_DISPUTE_LOG',
  DELIVERY_DISPUTE_SETTLEMENT_OFFER = 'NEW_DELIVERY_DISPUTE_SETTLEMENT_OFFER',
  DELIVERY_DISPUTE_SETTLEMENT_OFFER_CANCELED = 'DELIVERY_DISPUTE_SETTLEMENT_OFFER_CANCELED',
  DELIVERY_DISPUTE_SETTLEMENT_OFFER_ACCEPTED = 'DELIVERY_DISPUTE_SETTLEMENT_OFFER_ACCEPTED',
  DELIVERY_DISPUTE_SETTLEMENT_OFFER_DECLINED = 'DELIVERY_DISPUTE_SETTLEMENT_OFFER_DECLINED',
  NEW_DISPUTE_CUSTOMER_SERVICE_AGENT = 'NEW_DISPUTE_CUSTOMER_SERVICE_AGENT',
  STRIPE_ACCOUNT_VERIFIED = "STRIPE_ACCOUNT_VERIFIED",
  CARRIER_PAYOUT_CLAIMED = "CARRIER_PAYOUT_CLAIMED",
  CARRIER_DELIVERY_REQUEST = "CARRIER_DELIVERY_REQUEST",
  CARRIER_DELIVERY_REQUEST_CANCELED = "CARRIER_DELIVERY_REQUEST_CANCELED",
  CARRIER_DELIVERY_REQUEST_DECLINED = "CARRIER_DELIVERY_REQUEST_DECLINED",
  CARRIER_DELIVERY_REQUEST_ACCEPTED = "CARRIER_DELIVERY_REQUEST_ACCEPTED"
}

export enum CARRY_NOTIFICATION_TARGET_TYPES {
  DELIVERY = 'DELIVERY',
  DELIVERY_DISPUTE = 'DELIVERY_DISPUTE',
  DELIVERY_DISPUTE_SETTLEMENT_OFFER = 'DELIVERY_DISPUTE_SETTLEMENT_OFFER',
  DELIVERY_TRACKING_UPDATE = 'DELIVERY_TRACKING_UPDATE',
}

export enum CARRY_ADMIN_ROLES {
  ADMINISTRATOR = 'ADMINISTRATOR',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
}

export enum DeliveryDisputeStatus {
  OPEN = "OPEN",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum DeliveryDisputeSettlementOfferStatus {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}






export enum COMMON_EVENT_TYPES {

  // socket actions
  SOCKET_TRACK = 'SOCKET_TRACK',
  SOCKET_UNTRACK = 'SOCKET_UNTRACK',
  SOCKET_TO_USER_EVENT = 'SOCKET_TO_USER_EVENT',
  SOCKET_JOIN_ROOM = 'SOCKET_JOIN_ROOM',
  SOCKET_LEAVE_ROOM = 'SOCKET_LEAVE_ROOM',

  // events
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_MESSAGING = 'NEW_MESSAGING',
  MESSAGING_EVENTS_SUBSCRIBED = 'MESSAGING_EVENTS_SUBSCRIBED',
  MESSAGING_EVENTS_UNSUBSCRIBED = 'MESSAGING_EVENTS_UNSUBSCRIBED',
  TO_MESSAGING_ROOM = 'TO_MESSAGING_ROOM',
  JOIN_TO_MESSAGING_ROOM = 'JOIN_TO_MESSAGING_ROOM',
  LEAVE_TO_MESSAGING_ROOM = 'LEAVE_TO_MESSAGING_ROOM',
  MESSAGE_TYPING = 'MESSAGE_TYPING',
  MESSAGE_TYPING_STOPPED = 'MESSAGE_TYPING_STOPPED',
  
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_UNFOLLOWER = 'NEW_UNFOLLOWER',
  NEW_CONVERSATION = 'NEW_CONVERSATION',
  NEW_CONVERSATION_MESSAGE = 'NEW_CONVERSATION_MESSAGE',
  CONVERSATION_MEMBER_ADDED = 'CONVERSATION_MEMBER_ADDED',
  CONVERSATION_MEMBER_REMOVED = 'CONVERSATION_MEMBER_REMOVED',
  CONVERSATION_MEMBER_LEFT = 'CONVERSATION_MEMBER_LEFT',
  CONVERSATION_EVENTS_SUBSCRIBED = 'CONVERSATION_EVENTS_SUBSCRIBED',
  CONVERSATION_EVENTS_UNSUBSCRIBED = 'CONVERSATION_EVENTS_UNSUBSCRIBED',
  CONVERSATION_MESSAGE_TYPING = 'CONVERSATION_MESSAGE_TYPING',
  CONVERSATION_MESSAGE_TYPING_STOPPED = 'CONVERSATION_MESSAGE_TYPING_STOPPED',
  CONVERSATION_UPDATED = 'CONVERSATION_UPDATED',
  CONVERSATION_DELETED = 'CONVERSATION_DELETED',
  
}