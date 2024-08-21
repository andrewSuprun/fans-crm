import { SetMetadata } from '@nestjs/common';

export const TokenType = (type: string) => SetMetadata('tokenType', type);
