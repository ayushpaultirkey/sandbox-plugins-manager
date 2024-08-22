async function getPackageById(packageId) {
    try {

        const response = await fetch(`https://raw.githubusercontent.com/ayushpaultirkey/sandbox-archive/master/packages/${packageId}.json`);
        
        if(!response.ok) {
            throw new Error("Package not found in archive");
        }
    
        const data = await response.json();
        return data;

    }
    catch(error) {
        throw error;
    }
}

async function getPluginById(pluginId) {
    try {

        const response = await fetch(`https://raw.githubusercontent.com/ayushpaultirkey/sandbox-archive/master/plugins/${pluginId}.json`);
        
        if(!response.ok) {
            throw new Error("Plugin not found in archive");
        }
    
        const data = await response.json();
        return data;

    }
    catch(error) {
        throw error;
    }
}

export default { getPackageById, getPluginById }