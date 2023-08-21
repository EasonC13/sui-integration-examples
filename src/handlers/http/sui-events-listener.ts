import { handleRequest } from 'src/core/utils/http';
import { ReadSuiEventsRequestModel } from 'src/models/sui-models';
import { readSuiEvents } from 'src/controllers/sui-listener-controller';

export const handler = async (event: any) =>
  handleRequest(
    ReadSuiEventsRequestModel,
    readSuiEvents,
    event
  );
