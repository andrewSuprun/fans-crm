import { Request } from 'express';
import { TokenType } from './token/token-type';

export const getTokenFromEvent = (
  event: Request,
  type: TokenType,
): string | null => {
  const authHeader = event.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1]; // Returns the token part of "Bearer <token>"
};
