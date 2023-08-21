import { UnauthorizedError } from 'src/core/errors';

const { Octokit } = require('@octokit/rest');

const generatePolicy = (principalId: any, effect: any, resource: any) => {
  const authResponse: any = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

export async function validateToken(event: any, _context: any, callback: any) {
  const token = event.headers.authorization ?? event.headers.Authorization;
  if (!token) {
    throw new UnauthorizedError('Authorization token is missing');
  }
  const octokit = new Octokit({
    auth: token,
  });
  try {
    const response = await octokit.users.getAuthenticated();
    return callback(
      null,
      generatePolicy(
        response.data.id,
        'Allow',
        event.routeArn ?? event.methodArn
      )
    );
  } catch (error) {
    throw new UnauthorizedError('Invalid authorization token');
  }
}
