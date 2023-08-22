export const sleep = (delayMs: number) =>
  new Promise<void>((resolve, _reject) => {
    setTimeout(() => {
      resolve();
    }, delayMs);
  });
