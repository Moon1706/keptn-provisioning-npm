import fetch from 'node-fetch';
import { Scheme } from '../types/scheme';
import { Auth } from '../types/auth';

export async function sendRequest(
    scheme: Scheme,
    auth: Auth,
    request: string,
    body = ''
) {
    const requestInfo = scheme.resources[request];
    const url = `${auth.keptnURL}/${scheme.baseURL}/${requestInfo.url}`;
    const headers = {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'x-token': auth.token,
    };
    console.log(`KEPNT: Info. Send request to URL: ${url}`);
    try {
        const response = await fetch(
            url,
            body
                ? {
                      method: requestInfo.method,
                      headers: headers,
                      body: body,
                  }
                : {
                      method: requestInfo.method,
                      headers: headers,
                  }
        );
        if (response.status >= 200 && response.status < 400) {
            console.log(
                `KEPTN: Ok! Action: '${request}', Statue code: '${response.status}'`
            );
        } else if (response.status === 404) {
            console.log(
                `KEPTN: Warning! Action: '${request}', Request URL '${url}', Status code: '${response.status}'. Probably resource doesn't exist`
            );
        } else {
            console.log(
                `KEPTN: Error! Action: '${request}', Request URL: '${url}', Method: '${requestInfo.method}', Body: '${body}', Status code: '${response.status}', Response: '${response}'`
            );
            throw new Error();
        }
        const text = await response.text();
        return text ? JSON.parse('{}') : JSON.parse(text);
        // return await response.json();
    } catch (err) {
        throw new Error(
            `KEPTN: Error! Trace: request '${request}', URL '${url}', method '${requestInfo.method}', body '${body}'`
        );
    }
}
