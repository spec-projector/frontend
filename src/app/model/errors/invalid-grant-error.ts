import { InvalidField } from './application-error';
import { Error, ErrorReason } from './error';

const NON_FIELD_ERROR = 'non_field_errors';
const NON_REASON_ERRORS = ['error_code', 'developer_message'];

export class InvalidGrantError extends Error {
  constructor(message: string = null) {
    super();
    if (!!message) {
      this.reasons = [new ErrorReason(message)];
    }
  }

  static create(data: any): Error {
    const err = new InvalidGrantError();

    const parse = (data: any) => {
      for (const key in data) {
        if (key === '__proto__') {
          continue;
        }

        const messages = data[key];
        if (messages instanceof Object) {
          parse(messages);
        } else if (messages instanceof Array) {
          for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            err.reasons.push(key !== NON_FIELD_ERROR
              ? new InvalidField(key, message)
              : new ErrorReason(message));
          }
        } else {
          err.reasons.push(NON_REASON_ERRORS.indexOf(key) !== -1 ? new InvalidField(key, messages) : new ErrorReason(messages));
        }

      }
    };
    parse(data);
    return err;
  }

  getMessages(): string[] {
    const messages: string[] = [];
    for (let i = 0; i < this.reasons.length; i++) {
      const reason: ErrorReason = this.reasons[i];
      messages.push(reason instanceof InvalidField ? `${reason.field}: ${reason.message}` : reason.message);
    }
    return messages;
  }
}
