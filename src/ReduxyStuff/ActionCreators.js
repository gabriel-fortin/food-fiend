export { toggleSelection }

function toggleSelection(entryId) {
    return {
        type: "ENTRY_TOGGLED",
        entryId: entryId,
    }
}
