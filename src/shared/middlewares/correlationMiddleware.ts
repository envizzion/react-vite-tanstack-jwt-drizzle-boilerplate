import { Injectable } from '@nestjs/common';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware {
    use(req: FastifyRequest, reply: FastifyReply, next: HookHandlerDoneFunction): void {
        const correlationId = req.headers['x-correlation-id'] || uuidv4();
        req.headers['x-correlation-id'] = correlationId; // Set the correlation ID in the request headers

        // Optionally, set the correlation ID in the response headers as well
        reply.header('x-correlation-id', correlationId);
        next();
    }
}
