export class Community {
  ipfsDoc: [string, string];

  tagsCount: number;

  timeCreate: number;

  isFrozen: boolean;

  constructor(community: any) {
    this.ipfsDoc = community.ipfsDoc;
    this.tagsCount = community.tagsCount;
    this.timeCreate = community.timeCreate;
    this.isFrozen = community.isFrozen;
  }
}

export type CommunityTranslation = {
  communityId: number;
  id: string;
  description: string;
  enableAutotranslation: boolean;
  language: string;
  name: string;
};

export class CommunityData extends Community {
  public id: string;

  public avatar: string;

  public name: string;

  public description: string;

  public language: string;

  public website: string;

  public communitySite: string;

  public translations?: CommunityTranslation[];

  public tags: any[];

  public documentation?: [string, string];

  constructor(community: any) {
    super(community);
    this.id = String(community?.id);
    this.avatar = community?.avatar;
    this.name = community?.name;
    this.description = community?.description;
    this.language = community?.language;
    this.website = community?.website;
    this.communitySite = community?.communitySite;
    this.translations = community?.translations;
    this.tags = community?.tags;
    this.documentation = community?.documentation;
  }
}
