import giturl from "./giturl.js";

async function getLatestPlugin(url) {
    try {

        const { repository, user } = giturl.gitParseURL(url);
        const release = giturl.gitReleaseURL(user, repository);

        const response = await fetch(release);
        
        if(!response.ok) {
            throw new Error("No release found");
        }
    
        const { assets } = await response.json();
        if(!assets || !assets[0]) {
            throw new Error("Invalid plugin release asset");
        }

        const { browser_download_url } = assets[0];

        return browser_download_url;

    }
    catch(error) {
        throw error;
    }
}


function getPluginByName(url, releases) {
    try {

        const { repository, user } = giturl.gitParseURL(url);
        if(!releases) {
            throw new Error("Invalid release data in archive");
        }

        const release = Object.keys(releases);
        const { tag, name } = releases[release];

        return giturl.gitReleaseFileURL(user, repository, tag, name);

    }
    catch(error) {
        throw error;
    }
}


export default { getLatestPlugin, getPluginByName }