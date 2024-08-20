import bundle from "./../library/bundle.js";

async function install(plugins = []) {
    try {

        for(const plugin of plugins) {

            const url = `http://localhost:3000/${plugin}.zip`;
            const download = bundle.download(url);

        }

    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export default install;