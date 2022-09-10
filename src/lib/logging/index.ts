const env = process.env.NEXT_PUBLIC_ENV;
const Logger = env === "local" ? console : { log: () => { return; }, error: () => { return; } };

export function log(...message: string[]) {
  Logger.log(message);
}

export function logError(error: unknown) {
  Logger.error(error);
}
