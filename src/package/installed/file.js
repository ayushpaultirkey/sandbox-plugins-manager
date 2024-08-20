import fs from "fs/promises";
import directory from "../../library/directory.js";

const {  __installed } = directory();

/**
    * 
    * @returns 
*/
async function hasFile() {
    try {
        await fs.access(__installed);
        return true;
    }
    catch(error) {
        console.error(error);
    }
}

/**
    * 
    * @returns 
*/
async function writeFile(data = {}) {
    try {

        await fs.writeFile(__installed, JSON.stringify(data));

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

/**
    * 
    * @returns 
*/
async function readFile() {
    try {

        let installed = {};

        if(await hasFile()) {
            const data = await fs.readFile(__installed);
            installed = JSON.parse(data.toString());
        }
        else {
            await writeFile(installed);
        }

        return installed;

    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export default { readFile, writeFile }