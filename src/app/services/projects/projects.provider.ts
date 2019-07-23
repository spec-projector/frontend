import { Config, HttpMockService, HttpService } from 'junte-angular';
import { AppConfig } from 'src/app-config';
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
    deps: [HttpService, HttpMockService, Config]
};
