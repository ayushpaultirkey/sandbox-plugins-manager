import { ipcMain, dialog, BrowserWindow } from "electron";
import storage from "../.bucket/storage.js";
import install from "./src/package/install.js";
import installed from "./src/library/installed.js";
import permission from "./src/package/permission.js";

ipcMain.handle("@manager-package-install", async(event, url) => {
    try {
        
        const packageId = storage.get("@package-id");

        if(!packageId) {
            throw new Error("Invalid package id");
        }

        const browserWindow = BrowserWindow.fromWebContents(event.sender);
        const permissions = await permission.get(packageId);
        
        if(!permissions || !permissions.includes("PACKAGE_INSTALL")) {

            const result = await dialog.showMessageBox(browserWindow, {
                "type": "question",
                "title": "Install confirmation",
                "message": "Do you want to allow the package installation?",
                "buttons": [
                    "Allow",
                    "Cancel"
                ]
            });

            if(result.response !== 0) {
                await dialog.showMessageBox(browserWindow, {
                    "type": "warning",
                    "title": "Install error",
                    "message": "Installation canceled",
                    "buttons": [
                        "Ok"
                    ]
                })
                throw new Error("Installation canceled by the user");
            }

        }

        await install(url, (id, ... data) => {
            // event.sender.send(id, ... data);
        });

    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

ipcMain.handle("@manager-package-getInstalled", async(event) => {
    try {
        return await installed.get(installed.enums.PACKAGES);
    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

ipcMain.handle("@manager-package-getInstalledMetadata", async(event, id) => {
    try {
        const { data: { getMetadata, enums } } = installed;
        const metadata = await getMetadata(id, enums.PACKAGES);
        return metadata;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

ipcMain.handle("@manager-package-getInstalledIcon", async(event, id) => {
    try {
        const { data: { getIcon, enums } } = installed;
        const icon = await getIcon(id, enums.PACKAGES);
        return icon.toString("base64");
    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

/**
    * Registers a package if its not installed
*/
ipcMain.handle("@manager-package-validate", async(event) => {
    try {
        
        // Get current package's id and check
        // if it's valid
        const packageId = storage.get("@package-id");
        if(!packageId) {
            throw new Error("Invalid package id");
        }

        // Check if the package is installed
        // if not then register it
        const data = await installed.getById(packageId, installed.enums.PACKAGES);

        if(!data) {
            const { name } = await installed.data.getMetadata(packageId, installed.data.enums.PACKAGES);
            await installed.add(packageId, name, installed.enums.PACKAGES);
        }

    }
    catch(error) {
        console.log(error);
        throw error;
    }
});


ipcMain.handle("@manager-plugin-getInstalled", async(event) => {
    try {
        return await installed.get(installed.enums.PLUGINS);
    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

ipcMain.handle("@manager-plugin-getInstalledMetadata", async(event, id) => {
    try {
        const { data: { getMetadata, enums } } = installed;
        const metadata = await getMetadata(id, enums.PLUGINS);
        return metadata;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

export default ipcMain;