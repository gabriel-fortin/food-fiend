export { importData }

function importData(data) {
    return {
        type: "IMPORT_DATA",
        data,
    }
}
