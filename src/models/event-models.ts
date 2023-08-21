export enum Network {
  Polygon = 1,
  Edgeware = 2,
  Sui = 3,
}

export class ReadNotificationsRequestModel {
  public network: Network;

  constructor(network: Network) {
    this.network = network;
  }
}

export class ReadNotificationsResponseModel {}

export class BaseEventModel {
  public contractEventName: string;

  public contractAddress: string;

  public transaction: string;

  public blockNumber: number;

  public timestamp: number;

  public network: Network;

  constructor(event: any) {
    this.contractEventName = event.event ?? '';
    this.contractAddress = event.address;
    this.transaction = event.transactionHash;
    this.timestamp = 0;

    this.contractEventName = event.event ?? event.event_name;
    this.contractAddress = event.address ?? event.contract_address;
    this.transaction = event.transactionHash ?? event.transaction_hash;
    this.blockNumber = event.blockNumber ?? event.block_number;
    this.timestamp = 0;
    this.network = event.network;
  }
}

export class EventListenerRequest {
  public transactions: any[];

  public network: Network;

  constructor(req: any) {
    const transactions: any[] = [];
    req.body.payload.forEach((item: any) =>
      transactions.push(...item.transactions)
    );
    this.transactions = transactions;
    this.network = req.network;
  }
}

export class PostCreatedEventModel extends BaseEventModel {
  public user: string;

  public communityId: string;

  public postId: string;

  constructor(event: any) {
    super(event);

    const args = event.args ?? event;
    this.user = args.user;
    this.communityId = `${event.network}-${String(args.communityId)}`;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
  }
}

export class PostEditedEventModel extends BaseEventModel {
  public user: string;

  public postId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
  }
}

export class ReplyEditedEventModel extends BaseEventModel {
  public user: string;

  public postId: string;

  public replyId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
    this.replyId = `${event.network}-${args.replyId}`;
  }
}

export class CommentEditedEventModel extends BaseEventModel {
  public user: string;

  public postId: string;

  public replyId: string;

  public commentId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
    this.replyId = `${event.network}-${args.parentReplyId}`;
    this.commentId = `${event.network}-${args.commentId}`;
  }
}

export class UserCreatedEventModel extends BaseEventModel {
  public userAddress: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.userAddress = args.userAddress;
  }
}

export class UserUpdatedEventModel extends BaseEventModel {
  public userAddress: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.userAddress = args.userAddress;
  }
}

export class FollowedCommunityEventModel extends BaseEventModel {
  public userAddress: string;

  public communityId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.userAddress = args.userAddress;
    this.communityId = `${event.network}-${String(args.communityId)}`;
  }
}

export class UnfollowedCommunityEventModel extends BaseEventModel {
  public userAddress: string;

  public communityId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.userAddress = args.userAddress;
    this.communityId = `${event.network}-${String(args.communityId)}`;
  }
}

export class RoleGrantedEventModel extends BaseEventModel {
  public account: string;

  public role: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.account = args.account;
    this.role = `${event.network}-${String(args.role)}`;
  }
}

export class RoleRevokedEventModel extends BaseEventModel {
  public account: string;

  public role: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.account = args.account;
    this.role = `${event.network}-${String(args.role)}`;
  }
}

export class CommunityCreatedEventModel extends BaseEventModel {
  public user: string;

  public id: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.id = `${event.network}-${String(args.id)}`;
  }
}

export class CommunityUpdatedEventModel extends BaseEventModel {
  public user: string;

  public id: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.id = `${event.network}-${String(args.id)}`;
  }
}

export class CommunityFrozenEventModel extends BaseEventModel {
  public user: string;

  public communityId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.communityId = `${event.network}-${String(args.communityId)}`;
  }
}

export class CommunityUnfrozenEventModel extends BaseEventModel {
  public user: string;

  public communityId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.communityId = `${event.network}-${String(args.communityId)}`;
  }
}

export class TagCreatedEventModel extends BaseEventModel {
  public user: string;

  public tagId: string;

  public communityId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.tagId = `${event.network}-${args.tagId}`;
    this.communityId = `${event.network}-${String(args.communityId)}`;
  }
}

export class TagUpdatedEventModel extends BaseEventModel {
  public user: string;

  public tagId: string;

  public communityId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.tagId = `${event.network}-${args.tagId}`;
    this.communityId = `${event.network}-${String(args.communityId)}`;
  }
}

export class PostDeletedEventModel extends BaseEventModel {
  public user: string;

  public postId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
  }
}

export class ChangePostTypeEventModel extends BaseEventModel {
  public user: string;

  public newPostType: number;

  public postId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.newPostType = args.newPostType;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
  }
}

export class ReplyDeletedEventModel extends BaseEventModel {
  public user: string;

  public postId: string;

  public replyId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
    this.replyId = `${event.network}-${args.replyId}`;
  }
}

export class CommentDeletedEventModel extends BaseEventModel {
  public user: string;

  public postId: string;

  public replyId: string;

  public commentId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
    this.replyId = `${event.network}-${args.parentReplyId}`;
    this.commentId = `${event.network}-${args.commentId}`;
  }
}

export class ConfigureNewAchievementNFTEventModel extends BaseEventModel {
  public achievementId: number;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.achievementId = args.achievementId;
  }
}

export class TransferEventModel extends BaseEventModel {
  public from: string;

  public to: string;

  public tokenId: any;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.from = args.from;
    this.to = args.to;
    this.tokenId = args.tokenId?.hex
      ? Number(args.tokenId.hex)
      : args.tokenId?.toNumber();
  }
}

export class GetRewardEventModel extends BaseEventModel {
  public user: string;

  public period: number;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.period = args.period;
  }
}

export class ItemVotedEventModel extends BaseEventModel {
  user: string;

  postId: string;

  replyId: string;

  commentId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
    this.replyId = `${event.network}-${args.replyId}`;
    this.commentId = `${event.network}-${args.commentId}`;
  }
}

export class ReplyMarkedTheBestEventModel extends BaseEventModel {
  user: string;

  postId: string;

  replyId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
    this.replyId = `${event.network}-${args.replyId}`;
  }
}

export class ReplyCreatedEventModel extends BaseEventModel {
  user: string;

  postId: string;

  parentReplyId: string;

  replyId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.parentReplyId = `${event.network}-${args.parentReplyId}`; // ???
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
    this.replyId = `${event.network}-${args.replyId}`;
  }
}

export class CommentCreatedEventModel extends BaseEventModel {
  user: string;

  postId: string;

  replyId: string;

  commentId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.user = args.user;
    this.postId = `${event.network}-${args.postId?.toNumber()}`;
    this.replyId = `${event.network}-${args.parentReplyId}`; // ~parentReplyId
    this.commentId = `${event.network}-${args.commentId}`;
  }
}

export class SetDocumentationTreeEventModel extends BaseEventModel {
  public userAddr: string;

  public communityId: string;

  constructor(event: any) {
    super(event);
    const args = event.args ?? event;
    this.userAddr = args.userAddr;
    this.communityId = `${event.network}-${String(args.communityId)}`;
  }
}
