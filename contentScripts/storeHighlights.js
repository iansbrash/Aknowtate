/** Stores the highlight (called when user activates highlight command) */
function storeHL(selection, container, anchorNode, focusNode, anchorOffset, focusOffset, URL, textContent, color, uniqueID, callback) {
    console.log("Starting storeHL");
    console.log("anchorNode.parentNode.hasChildNodes: " + anchorNode.parentNode.hasChildNodes());

    chrome.storage.sync.get(URL, function(value){
        if (textContent === ""){
            console.log("Tried to highlight whitespace. That aint gonna happen.");
            return;
        }

        /** We do this because chrome.storage API is weird :) */
        value = value[URL];

        console.log("got key: " + URL);

        if (!value){
            value = new Array();
            console.log("New website visited... creating new array");
            console.log(value.type);
        } else {
            console.log(value[0].type);
        }

        let containerIndexArray = findPathToNodeTry2(container);
        let anchorNodeIndexArray = findPathToNodeTry2(anchorNode);
        let focusNodeIndexArray = findPathToNodeTry2(focusNode);

        console.log("anchorNode.parentNode.hasChildNodes(): " + anchorNode.parentNode.hasChildNodes());

        /** Push new object into the array which represents the URL we're currently on */
        /** This is how highlights are stored... each URL has a corresponding array of objects, where each object is a highlight */
        value.push({
            selection: selection,
            container: container,
            anchorNode: anchorNode,
            focusNode: focusNode,
            anchorOffset: anchorOffset,
            focusOffset: focusOffset,
            URL: URL,
            highlightTextContent: textContent,
            containerIndexArray: containerIndexArray,
            anchorNodeIndexArray: anchorNodeIndexArray,
            focusNodeIndexArray: focusNodeIndexArray,
            color: color,
            uniqueID: uniqueID,
            annotation: null,
            anchorNodeTextContent: anchorNode.textContent,
            focusNodeTextContent: focusNode.textContent,
            hasCorrectedOffsets: false
        })

        console.log("value's anchorOffset: " + value[0].anchorOffset);

        chrome.storage.sync.set({[URL]: value}, function(){
            console.log("Storage completed");
            if (callback){
                /** Callback is typically just highlighting the text on screen (since it has been stored now */
                callback();
            }
        })
    })
}