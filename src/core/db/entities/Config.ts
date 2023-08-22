export class Config {
  public key?: string;

  public value?: string;

  constructor(props: Config) {
    this.key = props.key;
    this.value = props.value;
  }
}
