import { Scheme } from '../../types/scheme';

export function generateResourceServiceScheme(
    project = '',
    stage = '',
    service = '',
    resourceURI = ''
): Scheme {
    return {
        baseURL: '/api/resource-service/v1',
        resources: {
            getListProjectResources: {
                url: `/project/${project}/stage/${stage}/service/${service}/resource`,
                method: 'get',
            },
            createServiceResources: {
                url: `/project/${project}/stage/${stage}/service/${service}/resource`,
                method: 'post',
            },
            updateServiceResources: {
                url: `/project/${project}/stage/${stage}/service/${service}/resource`,
                method: 'put',
            },
            deleteServiceResources: {
                url: `/project/${project}/stage/${stage}/service/${service}/resource/${encodeURIComponent(
                    encodeURIComponent(resourceURI)
                )}`,
                method: 'delete',
            },
        },
    } as Scheme;
}
