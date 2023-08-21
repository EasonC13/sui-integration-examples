export class User {
  ipfsDoc: [string, string];

  energy: any;

  lastUpdatePeriod: any;

  followedCommunities: any[];

  constructor(user: any) {
    [
      this.ipfsDoc,
      this.energy,
      this.lastUpdatePeriod,
      this.followedCommunities,
    ] = user;
  }
}

export class UserData extends User {
  public displayName?: string;

  public company?: string;

  public position?: string;

  public location?: string;

  public about?: string;

  public avatar?: string;

  constructor(user: any) {
    super(user);
    this.displayName = user?.displayName;
    this.company = user?.company;
    this.position = user?.position;
    this.location = user?.location;
    this.about = user?.about;
    this.avatar = user?.avatar;
  }
}
