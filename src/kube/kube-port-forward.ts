import { Config } from '../types/config';
import { KubeConnect } from '../types/kube-config';
import { Auth } from '../types/auth';
import { decode } from 'js-base64';
import * as k8s from '@kubernetes/client-node';
import * as net from 'net';
import { updateResources } from '../update/main';

export async function kubeUpdateService(
    kubeConnect: KubeConnect,
    config: Config
) {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const forward = new k8s.PortForward(kc);

    // Get Keptn API token
    const token = await k8sApi
        .readNamespacedSecret(kubeConnect.secret, kubeConnect.namespace)
        .then((res) => {
            const data = res.body.data as any;
            return decode(data[kubeConnect.secret]);
        });
    console.log(
        `KUBE: Got Keptn API token from secret (***${token.slice(-2)})`
    );

    // Get Pod name from service
    const podName = await k8sApi
        .listNamespacedPod(kubeConnect.namespace)
        .then((pods) => {
            return pods.body.items
                .map((pod) => pod.metadata?.name)
                .filter((name) =>
                    new RegExp(kubeConnect.service, 'i').test(name as string)
                )[0];
        });
    console.log(
        `KUBE: Service name for port-forwarding: ${kubeConnect.service}`
    );
    console.log(`KUBE: Pod name for port-forwarding: ${podName}.`);

    // Start port forwarding
    const hostname = 'localhost';
    const port = 8080;
    const server = net.createServer((socket) => {
        forward.portForward(
            kubeConnect.namespace,
            podName as string,
            [port],
            socket,
            null,
            socket
        );
    });
    try {
        server.listen(port, hostname);
        console.log('KUBE: Up net server.');
    } catch (error) {
        throw new Error(`KUBE: Error with start net server! ${error}`);
    }

    // Update service
    const sleepTime = 2;
    console.log(`KUBE: Waiting... Sleep time: ${sleepTime} sec.`);
    await new Promise((r) => setTimeout(r, sleepTime * 1000));
    await updateResources(
        { keptnURL: `http://${hostname}:${port}`, token: token } as Auth,
        config
    );

    // Stop port forwarding
    try {
        server.close(function () {
            server.unref();
        });
        console.log('KUBE: Stop server.');
    } catch (error) {
        throw new Error(`KUBE: Error with stop net server! ${error}`);
    }
}
