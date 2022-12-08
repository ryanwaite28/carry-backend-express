import { Op } from 'sequelize';
import { CatchAsyncServiceError } from '../decorators/service-method-error-handler.decorator';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { ServiceMethodAsyncResults, PlainObject, ServiceMethodResults } from '../interfaces/common.interface';
import { Messagings, Users, Messages } from '../models/delivery.model';
import { paginateTable } from '../repos/_common.repo';
import { user_attrs_slim } from '../utils/constants.utils';



export class MessagingsService {
  @CatchAsyncServiceError()
  static async get_user_messagings_all(user_id: number): ServiceMethodAsyncResults {
    const messagings_models = await Messagings.findAll({
      where: {
        [Op.or]: [
          { user_id },
          { sender_id: user_id },
        ]
      },
      include: [{
        model: Users,
        as: 'sender',
        attributes: user_attrs_slim
      }, {
        model: Users,
        as: 'user',
        attributes: user_attrs_slim
      }],
      order: [['updated_at', 'DESC']]
    });

    const newList = [];
    for (const messaging of messagings_models) {
      const messagingObj: PlainObject = messaging.toJSON();
      const other_user_id = messagingObj.sender_id === user_id
        ? messagingObj.user_id
        : messagingObj.sender_id;
      const unread_messages_count = await Messages.count({
        where: {
          from_id: other_user_id,
          to_id: user_id,
          opened: false
        }
      });
      messagingObj.unread_messages_count = unread_messages_count;
      newList.push(messagingObj);
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: newList
      }
    };
    return serviceMethodResults;
  }

  @CatchAsyncServiceError()
  static async get_user_messagings(user_id: number, messagings_timestamp: string): ServiceMethodAsyncResults {
    const whereClause: PlainObject = {
      [Op.or]: [
        { user_id: user_id },
        { sender_id: user_id },
      ]
    };
    if (messagings_timestamp) {
      whereClause.updated_at = { [Op.lt]: messagings_timestamp };
    }

    const messagings_models = await paginateTable(
      Messagings,
      '',
      undefined,
      undefined,
      [{
        model: Users,
        as: 'sender',
        attributes: user_attrs_slim
      }, {
        model: Users,
        as: 'user',
        attributes: user_attrs_slim
      }],
      undefined,
      undefined,
      whereClause,
      [['updated_at', 'DESC']]
    );

    const newList = [];
    for (const messaging of messagings_models) {
      const messagingObj: PlainObject = messaging.toJSON();
      const other_user_id = messagingObj.sender_id === user_id
        ? messagingObj.user_id
        : messagingObj.sender_id;
      const unread_messages_count = await Messages.count({
        where: {
          from_id: other_user_id,
          to_id: user_id,
          opened: false
        }
      });
      messagingObj.unread_messages_count = unread_messages_count;
      console.log(messagingObj);
      newList.push(messagingObj);
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: newList
      }
    };
    return serviceMethodResults;
  }
}