import installed from "./../library/installed.js";

/**
    * 
    * @returns {Promise<[string]>}
*/
async function get(id) {
    try {

        const data = await installed.getById(id, installed.enums.PACKAGES);
        if(data && data.permission) {
            return data.permission;
        }

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

const enums = {
    FILE_READ: 0,
    FILE_WRITE: 1,
    DIR_READ: 2,
    DIR_WRITE: 3,
    PACKAGE_INSTALL: 4,
    PLUGIN_INSTALL: 5
}

export default { get, enums }