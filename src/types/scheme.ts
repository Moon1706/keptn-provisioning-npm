export type Scheme = {
    baseURL: string;
    resources: Resources;
};

type Resource = {
    url: string;
    method: string;
};

type Resources = { [key: string]: Resource };
