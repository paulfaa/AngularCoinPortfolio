export default class StorageUtils {
    //refactor to single method that checks data type
    static writeToStorage(keyName: string, dataToSave) {
        localStorage.setItem(keyName, JSON.stringify(dataToSave));
    }

    static readFromStorage(keyName: string): any {
        try {
            var data = localStorage.getItem(keyName);
            if (data != null || data != undefined || data != "undefined") {
                return JSON.parse(data);
            }
            else {
                console.log("Nothing in local storage with key " + keyName);
                return null;
            }
        }
        catch (err) {
            console.log('Error: ', err.message);
        }
    }

    static writeMapToStorage(keyName: string, mapToSave: Map<any, any>) {
        localStorage.setItem(keyName, JSON.stringify(Array.from(mapToSave.entries())));
    }

    static readMapFromStorage(keyName: string): Map<any, any> {
        try {
            var data = localStorage.getItem(keyName);
            if (data != null || data != undefined || data != "undefined") {
                return new Map(JSON.parse(data));
            }
            else {
                console.log("Nothing in local storage with key " + keyName);
                return null;
            }
        }
        catch (err) {
            console.log('Error: ', err.message);
        }
    }

    static clearAllStorage(): void {
        localStorage.clear();
        console.log("Cleared all storage");
    }
}