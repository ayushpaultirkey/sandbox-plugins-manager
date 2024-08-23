import fs from "fs/promises";
import directory from "./../directory.js";

const { __data: { __packages, __plugins } } = directory();

const enums = {
    PLUGINS: __plugins,
    PACKAGES: __packages,
}

/**
    * 
    * @returns 
*/
async function hasFile(target = enums.PACKAGES) {
    try {
        await fs.access(target);
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
async function writeFile(data = {}, target = enums.PACKAGES) {
    try {

        await fs.writeFile(target, JSON.stringify(data));

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
async function readFile(target = enums.PACKAGES) {
    try {

        let installed = {};

        if(await hasFile()) {
            const data = await fs.readFile(target);
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

export default { readFile, writeFile, enums }