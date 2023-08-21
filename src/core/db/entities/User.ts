type UserProps = {
  id?: number;

  login?: string;
  avatar_url?: string;
}

export class User {
  public id?: number;
  public login?: string;
  public avatar_url?: string;

  constructor(props: UserProps) {
    this.login = props.login;
    this.id = props.id;
    this.avatar_url = props.avatar_url;
  }
}
