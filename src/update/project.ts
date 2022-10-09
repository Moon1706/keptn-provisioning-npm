import { Auth } from '../types/auth';
import { Project } from '../types/config';
import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';
import { generateControlPlaneScheme } from '../api/schemes/control-plane';
import { sendRequest } from '../api/requests';
import { generateProjectBody } from '../api/body';

export async function updateProject(project: Project, auth: Auth) {
    const apiURL = new URL(project.github.url);
    if (project.github.isEnterprise) {
        apiURL.pathname = `/api/v3`;
    } else {
        apiURL.hostname = `api.${apiURL.hostname}`;
    }
    const github = new Octokit({
        auth: project.github.token,
        baseUrl: apiURL.href.replace(/\/$/, ''),
    });
    try {
        console.log(
            `KEPTN: check Github repo '${apiURL}/${project.github.owner}/${project.github.repo}'`
        );
        await github.rest.repos.get({
            owner: project.github.owner,
            repo: project.github.repo,
        });
    } catch (err) {
        try {
            const checkError = err as RequestError;
            if (checkError.status === 404) {
                console.log(
                    `KEPTN: repo '${apiURL}/${project.github.owner}/${project.github.repo}' doesn't exist. Creation new repo.`
                );
                if (project.github.isOrganization) {
                    await github.rest.repos.createInOrg({
                        org: project.github.owner,
                        name: project.github.repo,
                        private: project.github.isPrivateRepo,
                    });
                } else {
                    await github.rest.repos.createForAuthenticatedUser({
                        name: project.github.repo,
                        private: project.github.isPrivateRepo,
                    });
                }
                console.log(
                    `KEPTN: repo '${apiURL}/${project.github.owner}/${project.github.repo}' was created.`
                );
            } else {
                console.log(
                    `KEPTN: Error! Repo: '${apiURL}/${project.github.owner}/${project.github.repo}', Status code: ${checkError.status}`
                );
                throw new Error();
            }
        } catch (err2) {
            const checkError = err2 as RequestError;
            console.log(
                `KEPTN: Error with creation repo! Message: '${checkError.message}', URL: ${checkError.request.url}, Method: ${checkError.request.method}, Body: ${checkError.request.body} Status: '${checkError.status}'`
            );
            throw new Error(
                `KEPTN: Error! Problem with checking/creation repo '${apiURL}/${project.github.owner}/${project.github.repo}'. Error ${err2}`
            );
        }
    }
    const controlPlane = generateControlPlaneScheme(project.name);
    if (
        (await sendRequest(controlPlane, auth, 'getProjectByName')).code === 404
    ) {
        await sendRequest(
            controlPlane,
            auth,
            'createNewProject',
            generateProjectBody(project)
        );
    } else {
        await sendRequest(
            controlPlane,
            auth,
            'updateProject',
            generateProjectBody(project)
        );
    }
}
