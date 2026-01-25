export const imageStore = {
    dbName: 'NutriScanImages',
    storeName: 'images',
    version: 1,

    async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
        });
    },

    async saveImage(base64Data: string): Promise<string> {
        const db = await this.openDB();
        const id = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            const request = store.add({ id, data: base64Data, timestamp: Date.now() });

            request.onsuccess = () => resolve(id);
            request.onerror = () => reject(request.error);
        });
    },

    async getImage(id: string): Promise<string | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);

            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result ? request.result.data : null);
            };
            request.onerror = () => reject(request.error);
        });
    },

    // Helper to clear old images if needed
    async clearOldImages(daysToKeep = 30) {
        const db = await this.openDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

        // This is a simple implementation; a cursor would be better for massive stores
        // but sufficient for a prototype
        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
            if (cursor) {
                if (cursor.value.timestamp < cutoff) {
                    cursor.delete();
                }
                cursor.continue();
            }
        };
    }
};
