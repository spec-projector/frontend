import { HttpMockService, HttpService } from 'junte-angular';
import { AppConfig } from 'src/app-config';
import { users_service } from 'src/app/services/users/users.interface';
import { UsersService } from 'src/app/services/users/users.service';
import { UsersMockService } from 'src/app/services/users/users.service.mock';

export function UsersServiceFactory(httpService: HttpService,
                                    httpMockService: HttpMockService,
                                    config: AppConfig) {
    return config.useMocks ?
        new UsersMockService() :
        new UsersService(httpService);
}

export const UsersServiceProvider = {
    provide: users_service,
    useFactory: UsersServiceFactory,
    deps: [HttpService, HttpMockService, AppConfig]
};
