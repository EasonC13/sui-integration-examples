export const SUI_INDEXING_QUEUE = `${process.env.ENV}-suiQueue.fifo`;
export const SUI_CONTENT_QUEUE = `${process.env.ENV}-suiContentQueue.fifo`;

const DB_CLUSTER_CREDENTIALS = 'DB_CLUSTER_CREDENTIALS';

export const SUI_EVENTS_MAPPING_SNS_TOPIC_NAME = `sui-events-mapping`;

export const credentialsSecret = {
  [SUI_INDEXING_QUEUE]: DB_CLUSTER_CREDENTIALS,
  [SUI_CONTENT_QUEUE]: DB_CLUSTER_CREDENTIALS,
};
