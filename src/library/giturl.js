function gitParseURL(url) {

    let user;
    let repository;

    const matchs = url.matchAll(/(?:https:\/\/github\.com\/)([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/gm);

    for(const match of matchs) {
        user = match[1];
        repository = match[2];
        break;
    }

    return { user: user, repository: repository }

}

function gitRawURL(repository, user, branch) {
    return `https://raw.githubusercontent.com/${user}/${repository}/${branch}`;
}

function gitReleaseURL(user, repository) {
    return `https://api.github.com/repos/${user}/${repository}/releases/latest`;
}

function gitReleaseFileURL(user, repository, tag, name) {
    return `https://github.com/${user}/${repository}/releases/download/${tag}/${name}`;
}

export default { gitParseURL, gitRawURL, gitReleaseURL, gitReleaseFileURL };