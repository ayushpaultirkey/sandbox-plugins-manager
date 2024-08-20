import installed from "./installed.js";

/**
    * 
    * @returns {Promise<[string]>}
*/
async function get(id) {
    try {

        const data = await installed.getById(id);
        if(data && data.permission) {
            return data.permission;
        }

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export default { get }