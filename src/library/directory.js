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
    const root = (typeof(PLUGIN_ROOT) !== "undefined") ? PLUGIN_ROOT : "../../";

    return {
        __filename: __filename,
        __dirname: __dirname,
        __data: {
            __root: path.join(__dirname, root, "data"),
            __packages: path.join(__dirname, root, "data/packages.json"),
            __plugins: path.join(__dirname, root, "data/plugins.json"),
        },
        __temp: path.join(__dirname, root, "temp"),
        __packages: path.join(__dirname, root, "../../packages"),
        __plugins: path.join(__dirname, root, "../../plugins"),
    };

};