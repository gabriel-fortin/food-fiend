export { toggleSelection, importData }

function toggleSelection(entryId) {
    return {
        type: "ENTRY_TOGGLED",
        entryId,
    };
}

function importData(data) {
    return {
        type: "IMPORT_DATA",
        data,
    }
}
