import { Token } from '../../../models/spec/planning/token';

export function joinTokens(tokens: Token[]): string {
  return tokens.map(t => t.toText()).join(' ');
}
