import { log, LogLevel } from './logger';
import { getSecretValue } from './secrets';
import { publishSlackMessage } from './slack';

export async function runTask(task: Function) {
  try {
    log(`Start executing task ${task.name}`);

    await task();
  } catch (error: any) {
    log('ECS task handler execution failed.', LogLevel.ERROR);
    log(error, LogLevel.ERROR);

    const slackChannel = await getSecretValue('API_ERRORS_SLACK_CHANNEL');
    await publishSlackMessage(
      slackChannel,
      `*API error reported: ECS task ${task} execution failed.*\n\`\`\`${error.stack}\`\`\``
    );
  }
}
