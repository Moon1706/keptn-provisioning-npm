import { Config } from '../types/config';
import { Auth } from '../types/auth';
import { updateProject } from './project';
import { updateService } from './service';

export async function updateResources(auth: Auth, config: Config) {
    for (const project of config.projects) {
        await updateProject(project, auth);
        await updateService(project, auth);
    }
}
