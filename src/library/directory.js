import url from "url";
import path from "path";

/**
    * 
    * @param {string} dir 
    * @returns 
*/
export default function directory(dir = import.meta.url) {

    const __filename = url.fileURLToPath(dir);
    const __dirname = path.dirname(__filename);
    const root = "../../";

    return {
        __filename: __filename,
        __dirname: __dirname,
        __data: path.join(__dirname, root, "data"),
        __temp: path.join(__dirname, root, "temp"),
        __installed: path.join(__dirname, root, "data/installed.json"),
        __package: path.join(__dirname, root, "../../package"),
    };

};