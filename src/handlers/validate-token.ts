import { validateToken } from 'src/controllers/validate-token-controller';

export const handler = async (event: any, context: any, callback: any) =>
  validateToken(event, context, callback);
