/** This function is called when a user highlights (Note: this function is NOT called when loading previous highlights */
chrome.storage.sync.get('color', (values) => {

    console.log("highlightHelper.js has been called");

    values = values.color;
    if (!values){
        values = "yellow";
    }

    let color = values;
    let selection = window.getSelection();
    let container = selection.getRangeAt(0).commonAncestorContainer;
    let selectionText = selection.toString();
    let websiteToStore = window.location.href;
    let anchorNode = selection.anchorNode;
    let focusNode = selection.focusNode;
    let anchorOffset = selection.anchorOffset;
    let focusOffset = selection.focusOffset;

    let selectionCopy = selection;
    let containerCopy = container.cloneNode(true);
    let selectionTextCopy = selectionText;
    let websiteToStoreCopy = websiteToStore;
    let anchorNodeCopy = anchorNode.cloneNode(true);
    let focusNodeCopy = $(focusNode).clone(true);
    let anchorOffsetCopy = anchorOffset;
    let focusOffsetCopy = focusOffset;

    let uniqueId = Date.now();

    /** Stores the highlight using the chrome.storage API */
    storeHL(selection, container, anchorNode, focusNode, anchorOffsetCopy, focusOffsetCopy, websiteToStore, selectionText, color, uniqueId, () => {

        /** After done storing, do the actual highlighting */
        highlightViaSwim(selection, container, anchorNode, focusNode, anchorOffset, focusOffset, color, uniqueId);

        /** Double checks to see if storage was successful */
        chrome.storage.sync.get(websiteToStore, function (result) {

            result = result[websiteToStore];

            for (let i = 1; i < result.length; i++){
                if (result[i].uniqueID === result[i-1].uniqueID){
                    result[i] = undefined;
                    console.log("Found a duplicate ID");
                }
            }
        })
    })
});