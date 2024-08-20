import { ipcMain, dialog, BrowserWindow } from "electron";
import path from "path";
import fs from "fs/promises";
import storage from "./../.bucket/storage.js";
import install from "./src/package/install.js";
import installed from "./src/package/installed.js";
import permission from "./src/package/permission.js";
import directory from "./src/library/directory.js";

const { __package } = directory();

ipcMain.handle("@package-install", async(event, url) => {
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

ipcMain.handle("@package-getInstalled", async(event) => {
    try {
        return await installed.get();
    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

ipcMain.handle("@package-getInstalledMetadata", async(event, id) => {
    try {
        const metadata = await installed.getMetadata(id);
        return metadata;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

ipcMain.handle("@package-getInstalledIcon", async(event, id) => {
    try {
        const icon = await installed.getIcon(id);
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
ipcMain.handle("@package-validate", async(event) => {
    try {
        
        // Get current package's id and check
        // if it's valid
        const packageId = storage.get("@package-id");
        if(!packageId) {
            throw new Error("Invalid package id");
        }

        // Check if the package is installed
        // if not then register it
        const data = await installed.getById(packageId);
        if(!data) {
            const { name } = await installed.getMetadata(packageId);
            await installed.add(packageId, name);
        }

    }
    catch(error) {
        console.log(error);
        throw error;
    }
});

export default ipcMain;