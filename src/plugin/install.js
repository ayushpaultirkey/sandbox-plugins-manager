import bundle from "./../library/bundle.js";
import archive from "../library/archive.js";
import release from "../library/release.js";
import directory from "../library/directory.js";

const { __plugins } = directory();

async function install(plugins = []) {
    try {

        for(const plugin of plugins) {

            const { repository: { url, releases } } = await archive.getPluginById(plugin);
            const releaseURL = (releases) ? release.getPluginByName(url, releases) : await release.getLatestPlugin(url);

            const { fileId, fileName } = await bundle.download(releaseURL,
                (progress) => {},
                (error) => {}
            );

            await bundle.extract(fileId, fileName);

            const { id: pluginId } = await bundle.metadata(fileId);
    
            await bundle.copy(fileId, pluginId, __plugins);
            await bundle.cleanup(fileId, fileName);
    
        }

    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export default install;