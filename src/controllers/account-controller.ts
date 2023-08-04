import { DynamoDBConnector } from 'src/core/db/DynamoDbConnector';
import { User } from 'src/core/db/entities/User';
import { UserRepository } from 'src/core/db/repositories/UserRepository';
import { BadRequestErrorWithBody, UnauthorizedError } from 'src/core/errors';
import {
  UserRegisterRequest,
  UserRegisterResponse,
} from 'src/models/user-models';

import { ACCOUNT_ALREADY_REGISTERED } from '../core/service-errors';

const { Octokit } = require('@octokit/rest');

const connDynamoDB = new DynamoDBConnector(process.env);
const userRepository = new UserRepository(connDynamoDB);

export async function register(
  request: UserRegisterRequest
): Promise<UserRegisterResponse> {
  const { token } = request;

  const octokit = new Octokit({
    auth: token,
  });

  let newUser = new User({});

  try {
    const response = await octokit.users.getAuthenticated();

    console.log(response.data);

    newUser = new User({
      login: response.data.login,
      id: response.data.id,
      avatar_url: response.data.avatar_url,
    });
  } catch (error) {
    throw new UnauthorizedError('Invalid authorization token');
  }

  console.log('newUser:', newUser);

  if (newUser.login && (await userRepository.hasKey(newUser.login))) {
    throw new BadRequestErrorWithBody({
      ...ACCOUNT_ALREADY_REGISTERED,
      message: `User by login ${newUser.login} already exists`,
    });
  }

  await userRepository.put(newUser);

  return new UserRegisterResponse(true);
}
