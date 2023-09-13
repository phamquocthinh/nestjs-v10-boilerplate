import { FastifyRequest } from 'fastify';

export interface IRequest extends FastifyRequest {
  user?: {
    uid: number;
    role: string;
    iat: number;
    exp: number;
  };
}
