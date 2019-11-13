import {Error, ErrorReason} from './error';
import {isArray, isObject, isString} from 'util';

const NON_FIELD_ERRORS = 'non_field_errors';

export class ApplicationError extends Error {

  constructor(message: string = null) {
    super();
    if (!!message) {
      this.reasons = [new ErrorReason(message)];
    }
  }

  static create(data: any): Error {
    const err = new ApplicationError();

    const parse = (parseData: any) => {
      for (const key in parseData) {
        if (key === '__proto__') {
          continue;
        }

        const messages = parseData[key];
        if (isObject(messages)) {
          parse(messages);
        } else if (isArray(messages)) {
          for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            err.reasons.push(key !== NON_FIELD_ERRORS
              ? new InvalidField(key, message)
              : new ErrorReason(message));
          }
        } else if (isString(messages)) {
          err.reasons.push(new ErrorReason(messages));
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

  toString(): string {
    return this.getMessages().join(', ');
  }
}

export class InvalidField extends ErrorReason {
  field: string;

  constructor(field: string, message: string) {
    super(message);
    this.field = field;
  }
}
