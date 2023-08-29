import { log } from 'src/core/utils/logger';

export async function processSuiEvent(event: any) {
  log(`Process sui event: ${JSON.stringify(event, null, 2)}`);

  // Add required processing here. Call weebhook or any other required action.
  // Note that if function call throws an excpetion then it will be called for the same events again.
}
