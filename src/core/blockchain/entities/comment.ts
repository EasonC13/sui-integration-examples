export class Comment {
  id2: string;

  ipfsDoc: [string, string];

  author: string;

  rating: number;

  postTime: number;

  propertyCount: number;

  language: number;

  isDeleted: boolean;

  constructor(comment: any) {
    this.id2 = comment.id2;
    this.ipfsDoc = comment.ipfsDoc;
    this.author = comment.author;
    this.rating = comment.rating;
    this.postTime = comment.postTime;
    this.propertyCount = comment.propertyCount;
    this.isDeleted = comment.isDeleted;
    this.language = comment.language;
  }
}

export class CommentData extends Comment {
  content: string;

  constructor(comment: any) {
    super(comment);
    this.content = comment?.content;
  }
}
