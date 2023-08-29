export const SUI_LISTENER_SQS_QUEUE_NAME = `${process.env.ENV}-suiListener.fifo`;
export const SUI_LISTENER_SNS_TOPIC_NAME = `${process.env.ENV}-suiListener`;

const VALIDATOR_MODULE_NAME = 'validator';

export const suiModules = [VALIDATOR_MODULE_NAME];
