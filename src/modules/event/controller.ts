import { container } from 'tsyringe';
import EventService from './service';
import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '@common/utils/logger';
import { EventType } from '@common/types/account';
import AppError from '@common/errors/AppError';
import { DepositOperationDTO, EventOperationDTO } from '@common/types/dto/controllers';
import { HttpResponse } from '@common/types/http';

type EventRequest = FastifyRequest<{
  Body: EventOperationDTO;
}>;

class EventController {
  public async operationFacade(req: EventRequest, reply: FastifyReply): Promise<FastifyReply> {
    const event = req.body;
    const { type, amount, destination } = event;
    const trackedId = req.id;

    let operation;

    switch (type) {
      case EventType.DEPOSIT:
        operation = await EventController.depositAdapter({ destination, amount }, trackedId);
        break;
      /**
       * case EventType.WITHDRAW:
        operation = await this.withdraw({ origin, amount }, reply);
      break;
      case EventType.TRANSFER:
        operation = await this.transfer({ origin, destination, amount }, reply);
      break;
       */
    }

    logger.info({ event, operation: operation.data }, `EventPerformed ${type}`);
    return reply.code(operation.statusCode).send(operation.data);
  }

  private static async depositAdapter(event: DepositOperationDTO, trackerId: string): Promise<HttpResponse> {
    const service = container.resolve(EventService);
    let statusCode, data, success;

    try {
      const operation = await service.depositOperation(event, trackerId);
      logger.info({ operation }, `DepositPerformed ${trackerId}`);

      statusCode = 201;
      data = operation;
      success = true;
    } catch (error) {
      const responseError = (error as AppError).toResponseError();
      logger.error({ error, responseError }, 'Deposit AppError raised!');

      statusCode = 404;
      data = 0;
      success = false;
    } finally {
      return { statusCode, success, data };
    }
  }
}

export default EventController;
