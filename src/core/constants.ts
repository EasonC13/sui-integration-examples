export const SUI_LISTENER_SQS_QUEUE_NAME = `${process.env.ENV}-suiListener.fifo`;
export const SUI_LISTENER_SNS_TOPIC_NAME = `${process.env.ENV}-suiListener`;

const SUI_POST_LIB = 'postLib';
const SUI_USER_LIB = 'userLib';
const SUI_COMMUNITY_LIB = 'communityLib';
const SUI_ACCESS_CONTROL_LIB = 'accessControlLib';
const SUI_FOLLOW_COMMUNITY_LIB = 'followCommunityLib';
const SUI_ACHIEVEMENT_LIB = 'achievementLib';

export const suiModules = [
  SUI_POST_LIB,
  SUI_USER_LIB,
  SUI_COMMUNITY_LIB,
  SUI_ACCESS_CONTROL_LIB,
  SUI_FOLLOW_COMMUNITY_LIB,
  SUI_ACHIEVEMENT_LIB,
];
