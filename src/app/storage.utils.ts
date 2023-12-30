import { PURCHASES_STORAGE_KEY } from "./shared/constants/constants";

export default class StorageUtils {
    //refactor to single method that checks data type
    public static writeToStorage(keyName: string, dataToSave) {
        localStorage.setItem(keyName, JSON.stringify(dataToSave));
    }

    public static readFromStorage(keyName: string): any {
        const data = localStorage.getItem(keyName);
            if (data != null || data != undefined || data != "undefined") {
                try{
                    return JSON.parse(data);
                }
                catch (err) {
                    console.log("Unable to process stored JSON for " + keyName);
                    console.log("Returning as string instead");
                    return data;
                }
            }
            else {
                console.log("Nothing in local storage with key " + keyName);
                return null;
            }
    }

    public static writeMapToStorage(keyName: string, mapToSave: Map<any, any>) {
        localStorage.setItem(keyName, JSON.stringify(Array.from(mapToSave.entries())));
    }

    public static readMapFromStorage(keyName: string): Map<any, any> {
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

    public static clearAllStorage(): void {
        localStorage.removeItem(PURCHASES_STORAGE_KEY);
        console.log("Cleared all stored purchases");
    }
}