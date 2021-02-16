import { Serializer } from 'serialize-ts';

export class SecureString implements Serializer<string> {

  serialize(str: string): string {
    return str !== '*' ? str : undefined;
  }

  deserialize(src: string): string {
    return src;
  }
}


