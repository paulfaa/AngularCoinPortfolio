export default class StorageUtils {
    static writeToStorage(keyName: string, dataToSave){
        localStorage.setItem(keyName, JSON.stringify(dataToSave));
    }

    static readFromStorage(keyName: string): any{
        var data = JSON.parse(localStorage.getItem(keyName));
        if(data != undefined){
            return data;
        }
        else{
            console.log("Nothing in local storage with key " + keyName);
            return null;
        }
    }
}