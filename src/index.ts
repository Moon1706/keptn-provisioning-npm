import { Config } from './types/config';
import { KubeConnect } from './types/kube-config';
import { Auth } from './types/auth';
import { load } from 'js-yaml';
import { kubeUpdateService } from './kube/kube-port-forward';
import { updateResources } from './update/main';

export async function provisioning(
    config: string,
    keptnAuth = '',
    kubeSettings = `{"enabled": false}`
) {
    const settingsObject = load(config);
    const settings = settingsObject as Config;
    const kubeConnectObject = load(kubeSettings);
    const kubeConnect = kubeConnectObject as KubeConnect;
    if (kubeConnect.enabled) {
        console.log('GLOBAL: Update services with Kubernetes connection.');
        console.log(
            `KUBE: KubeAPISettings: ${JSON.stringify(kubeConnectObject)}`
        );
        return await kubeUpdateService(kubeConnect, settings);
    } else {
        console.log('GLOBAL: Update services with API URL and token.');
        return updateResources(load(keptnAuth) as Auth, settings);
    }
}
