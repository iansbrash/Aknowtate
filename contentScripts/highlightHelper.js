
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


        /** TODO: FIND A WAY TO INDEX THE ANCHORNODE, CONTAINER, AND FOCUSNODE SO WE CAN FIND THEM UPON NEW PAGE LOAD AND HIGHLIGHT */

        let uniqueId = Date.now();

        storeHL(selection, container, anchorNode, focusNode, anchorOffsetCopy, focusOffsetCopy, websiteToStore, selectionText, color, uniqueId, () => {

            //findPathToNode(anchorNode);

 /**
            chrome.storage.sync.get(websiteToStore, function (result){
                console.log("inside testing chrome.storage.sync.get callback");

                result = result[websiteToStore];
                console.log("result[0].anchorOffset: " + result[0].anchorOffset);
                console.log("result[0].anchorNode.parentNode.hasChildNodes: " + result[0].anchorNode.parentNode.hasChildNodes)
                console.log("result[0].anchorNode.textContent: " + result[0].anchorNode.textContent);
            }) */

            /** After done storing, do the actual highlighting */



            highlightViaSwim(selection, container, anchorNode, focusNode, anchorOffset, focusOffset, color, uniqueId);


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

/** We store highlights as an ARRAY of OBJECTS. Each object will contain:
 *      selection, selectionText
 * And the objects will be stored with the URL as their key. Each object in the array represents a highlight by the user
 * */