export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
}

export const log = (obj: any, _level: LogLevel = LogLevel.INFO): void => {
  console.log(obj);
};
