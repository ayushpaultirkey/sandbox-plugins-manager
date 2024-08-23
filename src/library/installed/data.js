import path from "path";
import fs from "fs/promises";
import directory from "./../directory.js";

const { __packages, __plugins } = directory();

const enums = {
    PLUGINS: __plugins,
    PACKAGES: __packages,
}

async function directoryExist(name, target = enums.PACKAGES) {
    try {
        await fs.access(path.join(target, name));
        return true;
    }
    catch(error) {
        return false;
    }
}

async function getMetadata(id, target = enums.PACKAGES) {
    try {

        const meta = await fs.readFile(path.join(target, id, "metadata.json"));
        const metaJSON = JSON.parse(meta);

        return metaJSON;

    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

async function getIcon(id, target = enums.PACKAGES) {
    try {

        const icon = await fs.readFile(path.join(target, id, "favicon.png"));
        return icon;

    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export default { getMetadata, getIcon, directoryExist, enums }