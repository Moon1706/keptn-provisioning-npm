# keptn-provisioning

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

[![NPM](https://nodei.co/npm/keptn-provisioning.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/keptn-provisioning/)

Create or update services of Keptn.

#### Example

```js
import { provisioning } from "keptn-provisioning";

// If you select this section will use port-forwarding and Keptn API token will get from K8s secrets
const useKuberneresContexToConnect = true;

const keptnResourcesInKubernetes = `{
  "namespace": "keptn",
  "secret": "keptn-api-token",
  "service": "api-gateway-nginx"
}`;

// If you have public Keptn URL and `useKuberneresContexToConnect = false` please fill these settings
const keptnAuth = `{
  "keptnURL": "",
  "token": ""
}`;

const config = `{
  "projects": [
    {
      "name": "test",
      "github": {
        "url": "https://github.test.com",
        "urlAPI": "https://github.test.com/api/v3",
        "user": "github-user",
        "token": "github-pat",
        "repo": "github-repo-name",
        "isOrg": true,
        "owner": "github-organization-name"
      },
      "stages": [
        {
          "name": "develop"
        }
      ],
      "services": [
        {
          "name": "test",
          // Upload all files from this folder
          "workdir": "services/test",
          "monitoring": {
            "enabled": true,
            "type": "prometheus"
          }
        }
      ],
      "shipyardPath": "projects/test/shipyard.yaml"
    }
  ]
}`;

provisioning(useKuberneresContexToConnect, keptnAuth, keptnResourcesInKubernetes, config);
```
