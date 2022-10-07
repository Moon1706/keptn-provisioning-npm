import { Auth } from '../types/auth';
import { Project } from '../types/config';
import { generateResourceServiceScheme } from '../api/schemes/resource-service';
import { generateControlPlaneScheme } from '../api/schemes/control-plane';
import { generateAPIServiceScheme } from '../api/schemes/api-service';
import { sendRequest } from '../api/requests';
import {
    generateServiceResourceBody,
    generateMonitorinEventBody,
} from '../api/body';

export async function updateService(project: Project, auth: Auth) {
    for (const stage of project.stages) {
        for (const service of project.services) {
            const controlPlane = generateControlPlaneScheme(
                project.name,
                stage.name,
                service.name
            );
            const resourceService = generateResourceServiceScheme(
                project.name,
                stage.name,
                service.name
            );
            const apiService = generateAPIServiceScheme();
            console.log(
                `KEPTN: Service: ${service.name}. Project: ${project.name}. Stage: ${stage.name}`
            );
            if (
                (await sendRequest(controlPlane, auth, 'getServiceByName'))
                    .code === 404
            ) {
                console.log('KEPTN: Action: create new service');
                await sendRequest(
                    controlPlane,
                    auth,
                    'createNewService',
                    `{"serviceName": "${service.name}"}`
                );
                await sendRequest(
                    resourceService,
                    auth,
                    'createServiceResources',
                    generateServiceResourceBody(service.workdir)
                );
                console.log('KEPTN: Service created.');
            } else {
                console.log('KEPTN: Action: update exist service');
                console.log('KEPTN: Delete previous service resources.');
                const allServiceResources = await sendRequest(
                    resourceService,
                    auth,
                    'getListProjectResources'
                );
                for (const resource of allServiceResources.resources) {
                    await sendRequest(
                        generateResourceServiceScheme(
                            project.name,
                            stage.name,
                            service.name,
                            resource.resourceURI
                        ),
                        auth,
                        'deleteServiceResources'
                    );
                }
                await sendRequest(
                    resourceService,
                    auth,
                    'updateServiceResources',
                    generateServiceResourceBody(service.workdir)
                );
                console.log('KEPTN: Uploaded new service resources');
            }
            if (service.monitoring.enabled) {
                await sendRequest(
                    apiService,
                    auth,
                    'forwardsReceivedEvent',
                    generateMonitorinEventBody(
                        project.name,
                        service.name,
                        service.monitoring.type
                    )
                );
                console.log('KEPTN: Enable monitoring');
            }
        }
    }
    console.log('KEPTN: Creation/Update finished.');
}
