import { toHexString } from 'src/core/utils/parser';
import { Network } from 'src/models/event-models';

export type Event = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  network: Network;
  parsedJson?: Record<string, any> | undefined;
  bcs?: string | undefined;
  timestampMs?: string | undefined;
};

export class BaseSuiEventModel {
  public transaction: string;

  public eventSeq: string;

  public packageId: string;

  public transactionModule: string;

  public sender: string;

  public type: string;

  public timestamp: number;

  public network: Network;

  constructor(event: Event) {
    this.transaction = event.id.txDigest;
    this.eventSeq = event.id.eventSeq;
    this.packageId = event.packageId;
    this.transactionModule = event.transactionModule;
    this.sender = event.sender;
    this.type = event.type;
    this.timestamp = Math.floor(Number(event.timestampMs) / 1000);
    this.network = event.network;
  }
}

export class UserCreatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
  }
}

export class UserUpdatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
  }
}

export class CommunityCreatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public communityId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.communityId = `${event.network}-${event.parsedJson?.communityId}`;
  }
}

export class CommunityUpdatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public communityId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.communityId = `${event.network}-${event.parsedJson?.communityId}`;
  }
}

export class TagCreatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public communityId: string;

  public tagId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.communityId = `${event.network}-${event.parsedJson?.communityId}`;
    this.tagId = `${event.network}-${Number(event.parsedJson?.tagKey)}`;
  }
}

export class TagUpdatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public communityId: string;

  public tagId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.communityId = `${event.network}-${event.parsedJson?.communityId}`;
    this.tagId = `${event.network}-${Number(event.parsedJson?.tagKey)}`;
  }
}

export class PostCreatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public communityId: string;

  public postId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.communityId = `${event.network}-${event.parsedJson?.communityId}`;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
  }
}

export class PostEditedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
  }
}

export class PostDeletedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
  }
}

export class ReplyCreatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  public parentReplyKey: string;

  public replyId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
    this.parentReplyKey = `${event.network}-${Number(
      event.parsedJson?.parentReplyKey
    )}`;
    this.replyId = `${event.network}-${Number(
      event.parsedJson?.replyMetaDataKey
    )}`;
  }
}

export class ReplyEditedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  public replyId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
    this.replyId = `${event.network}-${Number(
      event.parsedJson?.replyMetaDataKey
    )}`;
  }
}

export class ReplyDeletedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  public replyId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
    this.replyId = `${event.network}-${Number(
      event.parsedJson?.replyMetaDataKey
    )}`;
  }
}

export class ReplyMarkedTheBestSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  public replyId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
    this.replyId = `${event.network}-${Number(
      event.parsedJson?.replyMetaDataKey
    )}`;
  }
}

export class ItemVotedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  public replyId: string;

  public commentId: string;

  public voteDirection: number;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
    this.replyId = `${event.network}-${Number(
      event.parsedJson?.replyMetaDataKey
    )}`;
    this.commentId = `${event.network}-${Number(
      event.parsedJson?.commentMetaDataKey
    )}`;
    this.voteDirection = Number(event.parsedJson?.voteDirection);
  }
}

export class FollowedCommunitySuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public communityId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.communityId = `${event.network}-${event.parsedJson?.communityId}`;
  }
}

export class UnfollowedCommunitySuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public communityId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.communityId = `${event.network}-${event.parsedJson?.communityId}`;
  }
}

export class CommentCreatedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  public replyId: string;

  public commentId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
    this.replyId = `${event.network}-${Number(
      event.parsedJson?.replyMetaDataKey
    )}`;
    this.commentId = `${event.network}-${Number(
      event.parsedJson?.commentMetaDataKey
    )}`;
  }
}

export class CommentEditedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  public replyId: string;

  public commentId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
    this.replyId = `${event.network}-${Number(
      event.parsedJson?.replyMetaDataKey
    )}`;
    this.commentId = `${event.network}-${Number(
      event.parsedJson?.commentMetaDataKey
    )}`;
  }
}

export class CommentDeletedSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public postId: string;

  public replyId: string;

  public commentId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.postId = `${event.network}-${event.parsedJson?.postMetaDataId}`;
    this.replyId = `${event.network}-${Number(
      event.parsedJson?.replyMetaDataKey
    )}`;
    this.commentId = `${event.network}-${Number(
      event.parsedJson?.commentMetaDataKey
    )}`;
  }
}

export class RoleGrantedSuiEventModel extends BaseSuiEventModel {
  public role: string;

  public userId: string;

  constructor(event: Event) {
    super(event);
    this.role = `${event.network}-${toHexString(event.parsedJson?.role)}`;
    this.userId = event.parsedJson?.userId;
  }
}

export class RoleRevokedSuiEventModel extends BaseSuiEventModel {
  public role: string;

  public userId: string;

  constructor(event: Event) {
    super(event);
    this.role = `${event.network}-${toHexString(event.parsedJson?.role)}`;
    this.userId = event.parsedJson?.userId;
  }
}

export class SetDocumentationTreeSuiEventModel extends BaseSuiEventModel {
  public userId: string;

  public communityId: string;

  constructor(event: Event) {
    super(event);
    this.userId = event.parsedJson?.userId;
    this.communityId = `${event.network}-${event.parsedJson?.communityId}`;
  }
}

export type SuiExportEventModel = Event & { name: string };
