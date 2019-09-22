export class Error {
  reasons: ErrorReason[] = [];

  getMessages(): string[] {
    return [];
  }

  toString() {
    return this.getMessages().join(', ');
  }
}

export class ErrorReason {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
