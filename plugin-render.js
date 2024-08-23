import { ipcRenderer } from "electron/renderer";

export default {
    manager: {
        package: {
            validate: async() => {
                try {
                    return await ipcRenderer.invoke("@manager-package-validate");
                }
                catch(error) {
                    throw error;
                };
            },
            getInstalled: async() => {
                try {
                    return await ipcRenderer.invoke("@manager-package-getInstalled");
                }
                catch(error) {
                    throw error;
                };
            },
            getInstalledMetadata: async(id) => {
                try {
                    return await ipcRenderer.invoke("@manager-package-getInstalledMetadata", id);
                }
                catch(error) {
                    throw error;
                };
            },
            getInstalledIcon: async(id) => {
                try {
                    const base64Image = await ipcRenderer.invoke("@manager-package-getInstalledIcon", id);
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
                            ipcRenderer.on("@manager-downloadProgress", options.onProgress);
                        }
                        if(options.onError) {
                            ipcRenderer.on("@manager-downloadError", options.onError);
                        }
                    }
    
                    await ipcRenderer.invoke("@manager-package-install", url);
                    
                    return true;
                    
                }
                catch(error) {
                    throw error;
                };
            }
        },
        plugin: {
            getInstalled: async() => {
                try {
                    return await ipcRenderer.invoke("@manager-plugin-getInstalled");
                }
                catch(error) {
                    throw error;
                };
            },
            getInstalledMetadata: async(id) => {
                try {
                    return await ipcRenderer.invoke("@manager-plugin-getInstalledMetadata", id);
                }
                catch(error) {
                    throw error;
                };
            },
        }
    }
}