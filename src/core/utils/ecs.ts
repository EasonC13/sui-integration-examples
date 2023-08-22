import { log, LogLevel } from './logger';

export async function runTask(task: () => Promise<void>) {
  try {
    log(`Start executing task ${task.name}`);

    await task();
  } catch (error: any) {
    log('ECS task handler execution failed.', LogLevel.ERROR);
    log(error, LogLevel.ERROR);
  }
}
