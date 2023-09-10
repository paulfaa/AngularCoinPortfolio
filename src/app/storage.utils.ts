export default class StorageUtils {
    static writeToStorage(keyName: string, dataToSave){
        localStorage.setItem(keyName, JSON.stringify(dataToSave));
    }

    static readFromStorage(keyName: string): any{
        try{
            var data = localStorage.getItem(keyName);
            if(data != null || data != undefined || data != "undefined"){
                //console.log("Stored data for key " +  keyName + ": " + data);
                return JSON.parse(data);
            }
            else{
                console.log("Nothing in local storage with key " + keyName);
                return null;
            }
        }
        catch(err){
            console.log('Error: ', err.message);
        }
    }

    static clearAllStorage(): void {
        localStorage.clear();
        console.log("Cleared all storage");
    }
}