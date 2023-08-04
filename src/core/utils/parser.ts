export function parseNullableInt(stringVal: string | undefined): number {
  if (stringVal === undefined) {
    return 0;
  }
  return parseInt(stringVal, 10);
}

export function parseObject(stringVal: string | undefined): any {
  if (!stringVal) {
    return undefined;
  }
  return JSON.parse(stringVal);
}

export function parseIntArray(stringArray: string[]): number[] {
  return stringArray.map((element) => parseNullableInt(element));
}

export function byteToHex(byte: number) {
  const unsignedByte = byte & 0xff; // eslint-disable-line no-bitwise

  if (unsignedByte < 16) {
    return `0${unsignedByte.toString(16)}`;
  }
  return unsignedByte.toString(16);
}

export function toHexString(bytes: []) {
  return Array.from(bytes)
    .map((byte) => byteToHex(byte))
    .join('');
}
