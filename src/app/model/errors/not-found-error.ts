import { InvalidField } from './application-error';
import { Error, ErrorReason } from './error';

export class NotFoundError extends Error {

  constructor(message: string = null) {
    super();
    if (!!message) {
      this.reasons = [new ErrorReason(message)];
    }
  }

  static create(data: any): Error {
    let err = new NotFoundError();

    let parse = (data: any) => {
      for (let key in data) {
        if (key == '__proto__') {
          continue;
        }

        let messages = data[key];
        if (messages instanceof Object) {
          parse(messages);
        } else if (messages instanceof Array) {
          for (let i = 0; i < messages.length; i++) {
            let message = messages[i];
            err.reasons.push(key != 'non_field_errors'
              ? new InvalidField(key, message)
              : new ErrorReason(message));
          }
        } else {
          err.reasons.push(new ErrorReason(messages));
        }

      }
    };
    parse(data);
    return err;
  }

  getMessages(): string[] {
    let messages: string[] = [];
    for (let i = 0; i < this.reasons.length; i++) {
      let reason: ErrorReason = this.reasons[i];
      messages.push(reason instanceof InvalidField ? `${reason.field}: ${reason.message}` : reason.message);
    }
    return messages;
  }

}
