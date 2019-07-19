export class LoginCredentials {
    login: string;
    password: string;

    constructor(credentials: LoginCredentials) {
        Object.assign(this, credentials);
    }
}
