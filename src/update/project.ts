import { Auth } from '../types/auth';
import { Project } from '../types/config';
import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';
import { generateControlPlaneScheme } from '../api/schemes/control-plane';
import { sendRequest } from '../api/requests';
import { generateProjectBody } from '../api/body';

export async function updateProject(project: Project, auth: Auth) {
    const github = new Octokit({
        auth: project.github.token,
        baseUrl: project.github.urlAPI,
    });
    try {
        console.log(
            `KEPTN: check Github repo '${project.github.owner}/${project.github.repo}'`
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
                    `KEPTN: repo '${project.github.owner}/${project.github.repo}' doesn't exist. Creation new repo.`
                );
                if (project.github.isOrg) {
                    await github.rest.repos.createInOrg({
                        org: project.github.owner,
                        name: project.github.repo,
                    });
                } else {
                    await github.rest.repos.createForAuthenticatedUser({
                        name: project.github.repo,
                    });
                }
                console.log(
                    `KEPTN: repo '${project.github.owner}/${project.github.repo}' was created.`
                );
            } else {
                throw new Error();
            }
        } catch (err2) {
            throw new Error(
                `KEPTN: Error! Problem with checking/creation repo '${project.github.owner}/${project.github.repo}'`
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
