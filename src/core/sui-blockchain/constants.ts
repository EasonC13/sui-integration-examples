const SUI_POST_LIB = 'postLib';
const SUI_USER_LIB = 'userLib';
const SUI_COMMUNITY_LIB = 'communityLib';
const SUI_ACCESS_CONTROL_LIB = 'accessControlLib';
const SUI_FOLLOW_COMMUNITY_LIB = 'followCommunityLib';

export const suiModules = [
  SUI_POST_LIB,
  SUI_USER_LIB,
  SUI_COMMUNITY_LIB,
  SUI_ACCESS_CONTROL_LIB,
  SUI_FOLLOW_COMMUNITY_LIB,
];

export const USER_CREATED_SUI_EVENT_NAME = 'userLib::CreateUserEvent';
export const USER_UPDATED_SUI_EVENT_NAME = 'userLib::UpdateUserEvent';

export const COMMUNITY_CREATED_SUI_EVENT_NAME =
  'communityLib::CreateCommunityEvent';
export const COMMUNITY_UPDATED_SUI_EVENT_NAME =
  'communityLib::UpdateCommunityEvent';
export const TAG_CREATED_SUI_EVENT_NAME = 'communityLib::CreateTagEvent';
export const TAG_UPDATED_SUI_EVENT_NAME = 'communityLib::UpdateTagEvent';
export const SET_DOCUMENTATION_TREE_SUI_EVENT_NAME =
  'communityLib::SetDocumentationTree';

export const FOLLOWED_COMMUNITY_SUI_EVENT_NAME =
  'followCommunityLib::FollowCommunityEvent';
export const UNFOLLOWED_COMMUNITY_SUI_EVENT_NAME =
  'followCommunityLib::UnfollowCommunityEvent';

export const POST_CREATED_SUI_EVENT_NAME = 'postLib::CreatePostEvent';
export const POST_EDITED_SUI_EVENT_NAME = 'postLib::EditPostEvent';
export const MODERATOR_POST_EDITED_SUI_EVENT_NAME =
  'postLib::ModeratorEditPostEvent';
export const POST_DELETED_SUI_EVENT_NAME = 'postLib::DeletePostEvent';
export const ITEM_VOTED_SUI_EVENT_NAME = 'postLib::VoteItem';
export const REPLY_CREATED_SUI_EVENT_NAME = 'postLib::CreateReplyEvent';
export const REPLY_EDITED_SUI_EVENT_NAME = 'postLib::EditReplyEvent';
export const MODERATOR_REPLY_EDITED_SUI_EVENT_NAME =
  'postLib::ModeratorEditReplyEvent';
export const REPLY_DELETED_SUI_EVENT_NAME = 'postLib::DeleteReplyEvent';
export const REPLY_MARKED_THE_BEST_SUI_EVENT_NAME =
  'postLib::ChangeStatusBestReply';
export const COMMENT_CREATED_SUI_EVENT_NAME = 'postLib::CreateCommentEvent';
export const COMMENT_EDITED_SUI_EVENT_NAME = 'postLib::EditCommentEvent';
export const COMMENT_DELETED_SUI_EVENT_NAME = 'postLib::DeleteCommentEvent';

export const ROLE_GRANTED_SUI_EVENT_NAME = 'accessControlLib::RoleGranted';
export const ROLE_REVOKED_SUI_EVENT_NAME = 'accessControlLib::RoleRevoked';
