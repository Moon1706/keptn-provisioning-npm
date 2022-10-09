export type Config = {
    projects: Projects;
};

type Projects = Array<Project>;

export type Project = {
    name: string;
    github: Github;
    stages: Stages;
    services: Services;
    shipyardPath: string;
};

type Github = {
    url: string;
    user: string;
    token: string;
    repo: string;
    owner: string;
    isPrivateRepo: boolean;
    isOrganization: boolean;
    isEnterprise: boolean;
};

type Stages = Array<Stage>;

type Stage = {
    name: string;
};

type Services = Array<Service>;

type Service = {
    name: string;
    workdir: string;
    monitoring: Monitoring;
};

type Monitoring = {
    enabled: boolean;
    type: string;
};
