import storage from "../../../.bucket/storage.js";
import file from "./installed/file.js";
import installedData from "./installed/data.js";

const STORAGE_ID = "@package.installed";

/**
    * 
    * @returns 
*/
async function get() {
    try {

        let installed = storage.get(STORAGE_ID);
        if(installed) {
            return installed;
        }

        installed = await file.readFile();
        storage.set(STORAGE_ID, installed);

        return installed;

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

async function getById(id) {
    try {

        let data = storage.get(id);
        if(data) {
            return data;
        }
        
        data = await get();
        if(data[id]) {
            storage.set(id, data);
            return data[id];
        }

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

/**
    * 
    * @param {*} metadata 
    * @returns 
*/
async function add(id, name) {
    try {

        const installed = await get();

        installed[id] = {
            id: id,
            name:name,
            permissions: []
        };

        await file.writeFile(installed);

        storage.set(STORAGE_ID, installed);
        storage.set(id, installed[id]);

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
async function remove(id) {
    try {

        const installed = await get();

        if(!installed[id]) {
            throw new Error("Package not found");
        }

        delete installed[id];

        await file.writeFile(installed);

        storage.set(STORAGE_ID, installed);
        storage.remove(id);

        return true;

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export default { get, getById, add, remove, ... installedData }