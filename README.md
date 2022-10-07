# keptn-update-services

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

[![NPM](https://nodei.co/npm/keptn-update-services.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/keptn-update-services/)

Create or update services of Keptn.

#### Example

```js
import { main } from "keptn-update-services";

const config = `
services:
  - name: k6
    projects:
      - artifactory
    stages:
      - develop
    workdir: services/k6`;
const namespace = "keptn";

main(config, namespace);
```
