const Logger = console;

export function log(...message: string[]) {
  Logger.log(message);
}

export function logError(error: unknown) {
  Logger.error(error);
}
