import bundle from "../library/bundle.js";
import directory from "../library/directory.js";
import installed from "./installed.js";

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

        const { id: packageId, name, icon } = await bundle.metadata(fileId);

        await bundle.copy(fileId, packageId, __packages);
        await bundle.cleanup(fileId, fileName);

        await installed.add(packageId, name, icon);

    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export default install;