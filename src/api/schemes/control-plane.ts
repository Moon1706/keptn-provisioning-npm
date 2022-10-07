import { Scheme } from '../../types/scheme';

export function generateControlPlaneScheme(
    project = '',
    stage = '',
    service = ''
): Scheme {
    return {
        baseURL: '/api/controlPlane/v1',
        resources: {
            createNewProject: {
                url: `/project`,
                method: 'post',
            },
            createNewService: {
                url: `/project/${project}/service`,
                method: 'post',
            },
            getProjectByName: {
                url: `/project/${project}`,
                method: 'get',
            },
            getServiceByName: {
                url: `/project/${project}/stage/${stage}/service/${service}`,
                method: 'get',
            },
            updateProject: {
                url: `/project`,
                method: 'put',
            },
        },
    } as Scheme;
}
