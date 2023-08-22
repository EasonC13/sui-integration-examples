import { processSuiEvent } from 'src/controllers/sui-events-controller';
import { handleSqsEvent } from 'src/core/utils/sqs';

export const handler = async (event: any) => {
  await handleSqsEvent(processSuiEvent, event);
};
