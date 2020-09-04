function storeHL(selection, container, anchorNode, focusNode, anchorOffset, focusOffset, URL, textContent, color, uniqueID, callback) {
    console.log("Starting storeHL");
    console.log("anchorNode.parentNode.hasChildNodes: " + anchorNode.parentNode.hasChildNodes());





    chrome.storage.sync.get(URL, function(value){

        if (textContent === ""){
            console.log("Tried to highlight whitespace. That shit aint gonna happen.");
            return;
        }



        /** TENTATIVE... seems to work */
        value = value[URL];

        console.log("got key: " + URL);
        //console.log("the value's type: " + value.type);

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
            /**
            chrome.storage.sync.get(URL, function (value){
                value = value[URL];
                console.log("Ok now we're inside the second storage.sync.get for testing");
                console.log("value[0].anchorNode.parentNode.hasChildren(): " + value[0].anchorNode.parentNode.hasChildNodes); */

            console.log("Storage completed");
            if (callback){
                callback();
            }


        })
    })



}