export class Reply {
  id2: string;

  ipfsDoc: [string, string];

  author: string;

  rating: number;

  postTime: number;

  parentReplyId: string;

  commentCount: number;

  propertyCount: number;

  language: number;

  isFirstReply: boolean;

  isQuickReply: boolean;

  isDeleted: boolean;

  historyVotes: { userId: string; direction: number }[];

  constructor(reply: any) {
    this.id2 = reply.id2;
    this.author = reply.author;
    this.parentReplyId = String(reply.parentReplyId);
    this.rating = reply.rating;
    this.postTime = reply.postTime;
    this.propertyCount = reply.propertyCount;
    this.commentCount = reply.commentCount;
    this.isDeleted = reply.isDeleted;
    this.ipfsDoc = reply.ipfsDoc;
    this.isFirstReply = reply.isFirstReply;
    this.isQuickReply = reply.isQuickReply;
    this.language = reply.language;
    this.historyVotes = reply.historyVotes;
  }
}

export class ReplyData extends Reply {
  content: string;

  constructor(reply: any) {
    super(reply);
    this.content = reply?.content;
  }
}
