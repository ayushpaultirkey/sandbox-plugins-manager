import storage from "../../../.bucket/storage.js";
import data from "./installed/data.js"
import file from "./installed/file.js";

const enums = {
    PLUGINS: "@plugins.installed",
    PACKAGES: "@packages.installed",
}

const enumsCast = (target) => {
    return (target === enums.PACKAGES) ? file.enums.PACKAGES : file.enums.PLUGINS
}

/**
    * 
    * @returns 
*/
async function get(target = enums.PACKAGES) {
    try {

        let installed = storage.get(target);
        if(installed) {
            return installed;
        }

        installed = await file.readFile(enumsCast(target));
        storage.set(target, installed);

        return installed;

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

async function getById(id, target = enums.PACKAGES) {
    try {

        const installed = await get(target);
        return installed[id];

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

/**
    * 
    * @param {*} id 
    * @param {*} name 
    * @param {*} target 
    * @returns 
*/
async function add(id, name, target = enums.PACKAGES) {
    try {

        const installed = await get(target);

        installed[id] = {
            id: id,
            name:name
        };

        if(target === enums.PACKAGES) {
            installed[id]["permissions"] = []
        }

        await file.writeFile(installed, enumsCast(target));
        storage.set(target, installed);

        console.log(name, "registered");

        return true;

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}


/**
    * 
    * @param {*} id 
    * @returns 
*/
async function remove(id, target = enums.PACKAGES) {
    try {

        const installed = await get(target);

        if(!installed[id]) {
            throw new Error("Plugin not found");
        }

        delete installed[id];

        await file.writeFile(installed, enumsCast(target));

        storage.set(target, installed);

        return true;

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}


export default { get, getById, add, remove, enums, data: data }