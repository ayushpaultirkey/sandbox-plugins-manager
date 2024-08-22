import fs from "fs/promises";
import directory from "../../library/directory.js";

const { __data: { __packages } } = directory();

/**
    * 
    * @returns 
*/
async function hasFile() {
    try {
        await fs.access(__packages);
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

        await fs.writeFile(__packages, JSON.stringify(data));

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
            const data = await fs.readFile(__packages);
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