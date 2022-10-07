import { Config } from './types/config';
import { KubeConnect } from './types/kube-config';
import { Auth } from './types/auth';
import { load } from 'js-yaml';
import { kubeUpdateService } from './kube/kube-port-forward';
import { updateResources } from './update/main';

export async function provisioning(
    getFromKube: boolean,
    auth: string,
    kubeAPISettings: string,
    config: string
) {
    const kubeConnectObject = load(kubeAPISettings);
    const settingsObject = load(config);
    const keptnAuth = load(auth) as Auth;
    const kubeConnect = kubeConnectObject as KubeConnect;
    const settings = settingsObject as Config;
    console.log(`GLOBAL: Config: ${JSON.stringify(settingsObject)}`);
    if (getFromKube) {
        console.log('GLOBAL: Update services with Kubernetes connection.');
        console.log(
            `KUBE: KubeAPISettings: ${JSON.stringify(kubeConnectObject)}`
        );
        return await kubeUpdateService(kubeConnect, settings);
    } else {
        console.log('GLOBAL: Update services with API URL and token.');
        return updateResources(keptnAuth, settings);
    }
}
