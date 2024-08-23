import resolve from "@rollup/plugin-node-resolve";
import replace from '@rollup/plugin-replace';
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import path from "path";

// npx rollup -c
export default {
    input: "./plugin-main.js",
    output: {
        file: "./plugin-main-build.js",
        format: "es"
    },
    plugins: [
        replace({
            PLUGIN_ROOT: JSON.stringify("./"),
            __dirname: JSON.stringify(path.resolve(process.cwd())),
            preventAssignment: true,
        }),
        resolve(),
        commonjs(),
        json()
    ],
    external: id => id.includes(".bucket") || id.includes("electron"),
};
