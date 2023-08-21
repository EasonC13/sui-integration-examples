export class Tag {
  ipfsDoc: [string, string];

  communityId: string;

  tagId: string;

  constructor(tag: any) {
    this.ipfsDoc = tag.ipfsDoc;
    this.communityId = String(tag.communityId);
    this.tagId = tag.tagId;
  }
}

export class TagData extends Tag {
  name: string;

  description: string;

  language?: number;

  translations?: { name: string; description: string; language: number }[];

  constructor(tag: any) {
    super(tag);
    this.name = tag.name;
    this.description = tag.description;
    this.language = tag.language;
    this.translations = tag.translations;
  }
}
