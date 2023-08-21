export class Config {
  public key?: string;

  public value?: string;

  constructor(props: { key?: string; value?: string }) {
    this.key = props.key;
    this.value = props.value;
  }
}
