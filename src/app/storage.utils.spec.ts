import StorageUtils from "./storage.utils";

describe('StorageUtils', () => {

    const testKey = "testData";

    beforeEach(() => {
        localStorage.removeItem(testKey);
  	});
    afterEach(() => {
        localStorage.removeItem(testKey);
  	});

    describe('writeToStorage()', () => {
        it('saves the provided date to local storage', () => {
            // Arrange
            const dataToSave = { name: 'John' };    

            // Act
            StorageUtils.writeToStorage(testKey, dataToSave);
            const savedData = JSON.parse(localStorage.getItem(testKey));

            // Assert
            expect(savedData).toEqual(dataToSave);
        });
    });

    describe('writeMapToStorage()', () => {
        it('saves the provided date to local storage', () => {
            // Arrange
            const mapToSave = new Map([
                ['key1', 'value1'],
                ['key2', 'value2'],
            ]);  

            // Act
            StorageUtils.writeMapToStorage(testKey, mapToSave);
            const savedData = JSON.parse(localStorage.getItem(testKey));
            const savedMap = new Map(savedData);

            // Assert
            expect(savedMap).toEqual(mapToSave);
        });
    });

    describe('readMapFromStorage()', () => {
        it('reads the provided map from local storage', () => {
            // Arrange
            const mapToSave = new Map([
                ['key1', 'value1'],
                ['key2', 'value2'],
            ]);
            StorageUtils.writeMapToStorage(testKey, mapToSave);
            
            // Act
            const result = StorageUtils.readMapFromStorage(testKey)

            // Assert
            expect(result).toEqual(mapToSave);
        });
    });
});