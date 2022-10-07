import { Config } from './types/config';
import { KubeConnect } from './types/kube-config';
import { Auth } from './types/auth';
import { load } from 'js-yaml';
import { kubeUpdateService } from './kube/kube-port-forward';
import { updateResources } from './update/main';

export async function main(
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

main(
    true,
    "{'keptnURL': '', 'token': ''}",
    "{'namespace': 'keptn', 'secret': 'keptn-api-token', 'service': 'api-gateway-nginx'}",
    `{"projects": [{"name": "test2", "github": {"url": "https://github.tools.sap", "urlAPI": "https://github.tools.sap/api/v3", "user": "C5345365", "token": "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", "repo": "keptninfratest", "isOrg": true, "owner": "artifactory-gcp"}, "stages": [{"name": "develop"}], "services": [{"name": "k6", "workdir": "services/k6", "monitoring": {"enabled": true, "type": "prometheus"}}], "shipyardPath": "projects/artifactory/shipyard.yaml"}]}`
);
