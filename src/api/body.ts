import { glob } from 'glob';
import { readFileSync } from 'fs';
import { encode } from 'js-base64';
import { join } from 'path';
import { Project } from '../types/config';

export function generateServiceResourceBody(workdir: string): string {
    const resources: any[] = [];
    const files = glob.sync('**/*', {
        cwd: workdir,
        nodir: true,
    });
    console.log(`KEPTN: Workdir: ${workdir}. Files: ${files}`);
    if (!files.length) {
        console.log(`KEPTN: Error! Files didn't find! Please check path.`);
        throw new Error();
    }
    for (const file of files) {
        resources.push({
            resourceContent: encode(readFileSync(join(workdir, file), 'utf8')),
            resourceURI: `/${file}`,
        });
    }
    const body = JSON.stringify({ resources: resources });
    return body;
}

export function generateMonitorinEventBody(
    project: string,
    service: string,
    type: string
): string {
    return `{
  "data": {
    "project": "${project}",
    "service":  "${service}",
    "type": "${type}"
  },
  "source": "js",
  "specversion": "1.0",
  "type": "sh.keptn.event.monitoring.configure",
  "shkeptnspecversion": "0.2.3"
}`;
}

export function generateProjectBody(project: Project, shipyardFile: string): string {
    return `{
  "gitCredentials": {
    "https": {
      "insecureSkipTLS": false,
      "token": "${project.github.token}"
    },
    "remoteURL": "${project.github.url}/${project.github.owner}/${
        project.github.repo
    }",
    "user": "${project.github.user}"
  },
  "name": "${project.name}",
  "shipyard": "${shipyardFile}"
}`;
}
