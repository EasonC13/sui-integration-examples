import { register } from 'src/controllers/account-controller';
import { handleRequest } from 'src/core/utils/http';
import { UserRegisterRequest } from 'src/models/user-models';

export const handler = async (event: any) =>
  handleRequest(UserRegisterRequest, register, event);
