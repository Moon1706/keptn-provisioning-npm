import { Scheme } from '../../types/scheme';

export function generateAPIServiceScheme(): Scheme {
    return {
        baseURL: '/api/v1',
        resources: {
            forwardsReceivedEvent: {
                url: `/event`,
                method: 'post',
            },
        },
    } as Scheme;
}
