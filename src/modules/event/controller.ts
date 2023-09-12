import { container } from 'tsyringe';
import EventService from './service';
import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '@common/utils/logger';
import { EventType, Operation } from '@common/types/account';
import AppError from '@common/errors/AppError';
import { AppErrorType } from '@common/errors/types';
import { destination } from 'pino';
import {
  DepositOperationDTO,
  DestinationEventDTO,
  EventOperationDTO,
  TransferOperationDTO,
  WithdrawOperationDTO,
} from '@common/types/dto/controllers';

type EventRequest = FastifyRequest<{
  Body: EventOperationDTO;
}>;

class EventController {
  public async operationFacade(req: EventRequest, reply: FastifyReply): Promise<FastifyReply> {
    const event = req.body;
    const { type, amount, destination, origin } = event;

    let operation: Promise<FastifyReply>;

    switch (type) {
      case EventType.DEPOSIT:
        operation = this.deposit({ destination, amount }, reply);
        break;
      /**
       * case EventType.WITHDRAW:
        operation = await this.withdraw({ origin, amount }, reply);
      break;
      case EventType.TRANSFER:
        operation = await this.transfer({ origin, destination, amount }, reply);
      break;
       */
      default:
        return reply.code(404).send(0);
        break;
    }

    logger.info({ type }, `EventPerformed ${origin}:${destination}`);
    return operation;
  }

  private async deposit(event: DepositOperationDTO, reply: FastifyReply): Promise<FastifyReply> {
    const service = container.resolve(EventService);

    try {
      const operation = await service.depositOperation(event);
      logger.info({ operation }, `DepositPerformed ${operation.destination}`);

      return reply.code(201).send(operation);
    } catch (error) {
      if (error instanceof AppError) {
        const responseError = error.toResponseError();
        logger.error({ responseError }, 'Deposit AppError raised!');
        return reply.code(404).send(0);
      }
      throw error;
    }
  }
}

export default EventController;
