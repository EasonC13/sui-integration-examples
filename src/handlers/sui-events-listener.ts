/* eslint-disable no-await-in-loop */
import { readSuiEvents } from 'src/controllers/sui-blockchain-controller';
import { runTask } from 'src/core/utils/ecs';
import { log } from 'src/core/utils/logger';
import { handleScheduleRequest } from 'src/core/utils/schedule';
import { sleep } from 'src/core/utils/time';
import { ReadSuiEventsRequestModel } from 'src/models/sui-models';

const DELAY_MS = 1000;

async function readSuiEventsLoop() {
  log('Start SUI listener.');
  while (true) {
    const request = new ReadSuiEventsRequestModel();
    await handleScheduleRequest(request, readSuiEvents);
    await sleep(DELAY_MS);
  }
}

const handler = async () => runTask(readSuiEventsLoop);
handler();
