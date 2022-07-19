import axios from "axios";

export interface Contributor {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    contributions: number;
}

async function getContributors(repo: string): Promise<Contributor[] | null> {
    const response = await axios.get(`https://api.github.com/repos/${repo}/contributors`).catch((error) => {
        console.error("An error occured while getting contributors" + error);
        return null;
    });

    if (!response) return null;
    if (response.status != 200) return null;
    const contributors: Contributor[] = response.data;

    return contributors;
}

export async function contributors(repo:string):Promise<string|null> {
    const contributors = await getContributors(repo);
    if(contributors == null) return null;
    let parsed = [];
    for(let contributor of contributors) {
        parsed.push(`- [${contributor.login}](${contributor.html_url}) (${contributor.contributions} contributions)`)
    }

    return parsed.join("\n");
}
