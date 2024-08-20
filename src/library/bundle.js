import path from "path";
import zip from "cross-zip";
import crypto from "crypto";
import Downloader from "nodejs-file-downloader";

import directory from "../../library/directory.js";

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

export default { download, extract }