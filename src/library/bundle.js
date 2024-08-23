import path from "path";
import fs from "fs/promises";
import fse from "fs-extra";
import zip from "cross-zip";
import crypto from "crypto";
import Downloader from "nodejs-file-downloader";

import directory from "./directory.js";

const { __temp } = directory();

/**
    * 
    * @param {*} url 
    * @param {*} onProgress 
    * @param {*} onError 
    * @returns 
*/
async function download(url, onProgress, onError) {
    try {

        const { pathname } = new URL(url);

        const fileName = pathname.slice(1, pathname.length);
        const fileExtension = path.extname(fileName);

        const downloadId = crypto.randomUUID();
        const downloadName = downloadId + fileExtension;

        const downloader = new Downloader({
            url: url,
            fileName: downloadName,
            directory: __temp,
            onProgress: function(percentage) {
                if(onProgress) {
                    onProgress(percentage);
                }
            },
            onError: function(error) {
                if(onError) {
                    onError(error);
                }
            }
        });
        
        await downloader.download();

        return {
            fileId: downloadId,
            fileName: downloadName
        }

    }
    catch(error) {
        console.log(error);
        throw error;
    }
}


/**
    * 
    * @param {*} tempId 
    * @param {*} bundleName 
    * @returns 
*/
async function extract(tempId, bundleName) {
    try {
        return new Promise((resolve, reject) => {

            const tempPath = path.join(__temp, tempId);
            const bundleFile = path.join(__temp, bundleName);

            zip.unzip(bundleFile, tempPath, (error) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });

        });
    }
    catch(error) {
        throw error;
    }
}


/**
    * 
    * @param {*} tempId 
    * @returns 
*/
async function metadata(tempId) {
    try {
        const data = await fs.readFile(path.join(__temp, tempId, "metadata.json"));
        const meta = JSON.parse(data.toString());
        if(!meta.id) {
            throw new Error("No metadata id");
        }
        return meta;
    }
    catch(error) {
        throw error;
    }
}


/**
    * 
    * @param {*} tempId 
    * @param {*} targetId 
    * @param {*} target 
*/
async function copy(tempId, targetId, target) {
    try {
        const tempPath = path.join(__temp, tempId);
        const targetPath = path.join(target, targetId);
        await fse.copy(tempPath, targetPath);
    }
    catch(error) {
        throw error;
    }
}


/**
    * 
    * @param {*} tempId 
    * @param {*} bundleName 
*/
async function cleanup(tempId, bundleName) {
    try {

        const tempPath = path.join(__temp, tempId);
        const bundlePath = path.join(__temp, bundleName);

        await fs.unlink(bundlePath);
        await fs.rm(tempPath, { recursive: true, force: true });

    }
    catch(error) {
        throw error;
    }
}

export default { download, extract, metadata, cleanup, copy }