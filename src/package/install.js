import bundle from "../library/bundle.js";
import directory from "../library/directory.js";
import installed from "../library/installed.js";
import pluginInstall from "./../plugin/install.js";

const { __packages } = directory();

async function install(url = "", callback) {
    try {

        const { fileId, fileName } = await bundle.download(url,
            (progress) => {
                callback("@package-downloadProgress", progress);
            },
            (error) => {
                console.log(error);
                callback("@package-downloadError");
            }
        );

        await bundle.extract(fileId, fileName);

        const { id: packageId, name, plugins } = await bundle.metadata(fileId);

        await bundle.copy(fileId, packageId, __packages);
        await bundle.cleanup(fileId, fileName);

        await pluginInstall(plugins);

        await installed.add(packageId, name, installed.enums.PACKAGES);

    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export default install;