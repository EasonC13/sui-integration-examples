import { RateLimiterMemory } from 'rate-limiter-flexible';

import { getHttpResponse, StatusCodes } from './http';

export const rateLimiter = new RateLimiterMemory({
  points: 1,
  duration: process.env.REQUESTS_PER_SECOND
    ? parseInt(process.env.REQUESTS_PER_SECOND)
    : 1,
  keyPrefix: 'graphql',
});

export async function handleRateLimit(
  event: any,
  next: () => Promise<any>,
  config: RateLimiterMemory = rateLimiter
): Promise<any> {
  const key = `${event.headers['user-agent']}:${
    event.requestContext?.http?.sourceIp ?? 'unknown'
  }`;

  try {
    await config.consume(key);
  } catch (rejRes) {
    return getHttpResponse(
      StatusCodes.TOO_MANY_REQUESTS,
      'Too many requests, please try again later'
    );
  }

  return next();
}
