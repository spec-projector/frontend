import { AppConfig } from 'src/app/app-config';
import { HttpMockService } from 'src/app/services/http-mock.service';
import { HttpService } from 'src/app/services/http.service';
import { projects_service } from 'src/app/services/projects/projects.interface';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ProjectsMockService } from 'src/app/services/projects/projects.service.mock';

export function ProjectsServiceFactory(httpService: HttpService,
                                       httpMockService: HttpMockService,
                                       config: AppConfig) {
    return config.useMocks ?
        new ProjectsMockService(httpMockService) :
        new ProjectsService(httpService);
}

export const ProjectsServiceProvider = {
    provide: projects_service,
    useFactory: ProjectsServiceFactory,
    deps: [HttpService, HttpMockService, AppConfig]
};
