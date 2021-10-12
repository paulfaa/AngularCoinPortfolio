export default class StorageUtils {
    static writeToStorage(keyName: string, dataToSave){
        localStorage.setItem(keyName, JSON.stringify(dataToSave));
    }

    static readFromStorage(keyName: string): any{
        var data = localStorage.getItem(keyName);
        if(data != undefined || "undefined"){
            return JSON.parse(data);
        }
        else{
            console.log("Nothing in local storage with key " + keyName);
            return null;
        }
    }
}