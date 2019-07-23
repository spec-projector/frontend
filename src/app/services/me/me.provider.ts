import { HttpMockService, HttpService } from 'junte-angular';
import { AppConfig } from 'src/app/app-config';
import { me_service } from 'src/app/services/me/me.interface';
import { MeService } from 'src/app/services/me/me.service';
import { MeMockService } from 'src/app/services/me/me.service.mock';


export function MeServiceFactory(httpService: HttpService, httpMockService: HttpMockService, config: AppConfig) {
    return config.useMocks ?
        new MeMockService(httpMockService) :
        new MeService(httpService);
}

export let MeServiceProvider = {
    provide: me_service,
    useFactory: MeServiceFactory,
    deps: [HttpService, HttpMockService, AppConfig]
};
