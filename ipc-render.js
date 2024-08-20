import { ipcRenderer } from "electron/renderer";

export default {
    bundle: {
        validate: async() => {
            try {
                return await ipcRenderer.invoke("@package-validate");
            }
            catch(error) {
                throw error;
            };
        },
        getInstalled: async() => {
            try {
                return await ipcRenderer.invoke("@package-getInstalled");
            }
            catch(error) {
                throw error;
            };
        },
        getInstalledMetadata: async(id) => {
            try {
                return await ipcRenderer.invoke("@package-getInstalledMetadata", id);
            }
            catch(error) {
                throw error;
            };
        },
        getInstalledIcon: async(id) => {
            try {
                const base64Image = await ipcRenderer.invoke("@package-getInstalledIcon", id);
                return `data:image/png;base64,${base64Image}`;
            }
            catch(error) {
                throw error;
            };
        },
        install: async(url = "", options) => {
            try {

                if(options) {
                    if(options.onProgress) {
                        ipcRenderer.on("@bundle-downloadProgress", options.onProgress);
                    }
                    if(options.onError) {
                        ipcRenderer.on("@bundle-downloadError", options.onError);
                    }
                }

                await ipcRenderer.invoke("@package-install", url);
                
                return true;
                
            }
            catch(error) {
                throw error;
            };
        }
    }
}