import { container } from 'tsyringe';
import ResetService from './service';
import { FastifyRequest, FastifyReply } from 'fastify';

class ResetController {
  public async reset(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const service = container.resolve(ResetService);
    await service.seed();
    return reply.code(200).send('OK');
  }
  public async wipe(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const service = container.resolve(ResetService);
    await service.wipe();
    return reply.code(200).send('OK');
  }
}

export default ResetController;
