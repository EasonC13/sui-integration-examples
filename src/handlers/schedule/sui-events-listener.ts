import { readSuiEvents } from 'src/controllers/sui-listener-controller';
import { handleScheduleRequest } from 'src/core/utils/schedule';

export const handler = async () => handleScheduleRequest({}, readSuiEvents);
