import bundle from "./../library/bundle.js";
import archive from "../library/archive.js";
import release from "../library/release.js";
import directory from "../library/directory.js";
import installed from "../library/installed.js";

const { __plugins } = directory();

async function install(plugins = []) {
    try {

        const pending = new Set(plugins);
        const finished = new Set();

        async function begin(plugin) {

            if(finished.has(plugin)) {
                return;
            }

            const { repository: { url, releases } } = await archive.getPluginById(plugin);
            const releaseURL = (releases) ? release.getPluginByName(url, releases) : await release.getLatestPlugin(url);

            const { fileId, fileName } = await bundle.download(releaseURL,
                (progress) => {},
                (error) => {}
            );

            await bundle.extract(fileId, fileName);

            const { id, name, dependencies } = await bundle.metadata(fileId);

            if(!id || !name) {
                throw new Error("Invalid plugin metadata");
            }
    
            await bundle.copy(fileId, id, __plugins);
            await bundle.cleanup(fileId, fileName);

            await installed.add(id, name, installed.enums.PLUGINS);
    
            if(dependencies) {
                for(const dependency of dependencies) {
                    if(!finished.has(dependency)) {
                        pending.add(dependency);
                    }
                }
            }

            finished.add(plugin);

        }

        while(pending.size > 0) {
            const plugin = pending.values().next().value;
            pending.delete(plugin);
            await begin(plugin);
        }

    }
    catch(error) {
        console.log(error);
        throw error;
    }
}


export default install;