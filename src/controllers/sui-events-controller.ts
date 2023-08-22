import { log } from 'src/core/utils/logger';

export async function processSuiEvent(event: any) {
  log(`Process sui event: ${JSON.stringify(event, null, 2)}`);
}
