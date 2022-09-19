export class OtapixError extends Error {
  public code: string;
  constructor(message: string, code: string) {
    super();
    this.message = message;
    this.code = code;
  }
}

export class PackCreationError extends OtapixError {
  constructor(code: string) {
    super("An error occured while creating a pack", code);
  }
}

export class PuzzleCreationError extends OtapixError {
  constructor(code: string) {
    super("An error occured while creating a puzzle", code);
  }
}

export class PuzzleEditError extends OtapixError {
  constructor(code: string) {
    super("An error occured while editing a puzzle", code);
  }
}


export class ProfileEditError extends OtapixError {
  constructor(code: string) {
    super("An error occured while editing user profile", code);
  }
}