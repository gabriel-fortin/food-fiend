export class StorageInfo {

    /** When this (version of) food item was created */
    addedOn: Date;

    /** Is this a "built-in" (shipped with the app) item? */
    isInitialItem: boolean;

    constructor(
        addedOn: Date,
        isInitialItem: boolean,
    ) {
        this.addedOn = addedOn;
        this.isInitialItem = isInitialItem;
    }
}
