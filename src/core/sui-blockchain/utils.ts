export function cleanEventType(eventType: string) {
  return eventType.substring(eventType.indexOf(':') + 2);
}

export function parseIntFromSuiBits(bits: string) {
  const hex = BigInt(bits).toString(16);
  if (hex.startsWith('80')) {
    // if negative
    return parseInt(hex.substring(2), 16) * -1;
  }
  return parseInt(bits, 10);
}

export const vectorU8ToString = (byteArray: any[]) => {
  const uint8Array = new Uint8Array(byteArray);
  return `0x${new TextDecoder('utf-8').decode(uint8Array)}`;
};

export enum VoteDirection {
  DIRECTION_DOWNVOTE = 4,
  DIRECTION_CANCEL_DOWNVOTE = 0,
  DIRECTION_UPVOTE = 3,
  DIRECTION_CANCEL_UPVOTE = 1,
}
