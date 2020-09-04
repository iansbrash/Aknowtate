selection = window.getSelection();
selectionText = selection.toString();
nodesToDelete = new Array();

jQueryIndexHighlight(selection);

function jQueryIndexHighlight(selection) {



    let aOff = selection.anchorOffset;
    let fOff = selection.focusOffset;

    let aNode = selection.anchorNode;
    let fNode = selection.focusNode;

    let commonAncestorContainer = selection.getRangeAt(0).commonAncestorContainer;

    console.log("aNode.compareDocumentPosition(commonAncestorContainer): " + (aNode.compareDocumentPosition(commonAncestorContainer)));
    console.log("aNode.compareDocumentPosition(aNode.parentNode): " + (aNode.compareDocumentPosition(aNode.parentNode)));
    console.log("aNode.compareDocumentPosition(fNode): " + (aNode.compareDocumentPosition(fNode)));

    if (aNode.isSameNode(fNode)) {

        /** Swaps anchorOffset and focusOffset if user highlights from right to left (instead of rtl) */
        if (aOff > fOff) {
            aOff = selection.focusOffset;
            fOff = selection.anchorOffset;
        }
        highlightIndividualNode(aOff, fOff, aNode);

        //deleteNodes();
        aNode.parentNode.removeChild(aNode);
    } else {
        /** Compares the focus and anchor.
         *  Changes the a/f Node/Off variables as needed if user highlights from right to left */
        if (firstNode(aNode, fNode) === aNode) {
            ;
        } else {
            aNode = selection.focusNode;
            fNode = selection.anchorNode;

            aOff = selection.focusOffset;
            fOff = selection.anchorOffset;
        }

        let aNodeCopy = aNode;
        let fNodeCopy = fNode;
        let aOffCopy = aOff;
        let fOffCopy = fOff;


        /** Swims each node up to one level below the commonAncestorContainer
         *  NOTE: This method of highlighting ONLY WORKS when the aNode and fNode is different */
        while (!aNode.parentNode.isSameNode(commonAncestorContainer)) {
            aNode = aNode.parentNode;
        }
        while (!fNode.parentNode.isSameNode(commonAncestorContainer)) {
            fNode = fNode.parentNode;
        }


        /** Indices used to highlight the text in between the nodes */
        let aNodeIndex = Math.abs($(commonAncestorContainer.childNodes).index(aNode));
        let fNodeIndex = Math.abs($(commonAncestorContainer.childNodes).index(fNode));
        console.log("aNodeIndex: " + aNodeIndex);
        console.log("fNodeIndex: " + fNodeIndex);


        /** Iterates through all the "surface-level" nodes in between the aNode and fNode and highlights them */
        for (let i = aNodeIndex + 1; i < fNodeIndex; i++) {
            if ($(commonAncestorContainer.childNodes).get(i).nodeType === Node.TEXT_NODE) {
                let repNode = returnHighlightedSpan($(commonAncestorContainer.childNodes).get(i));
                $(commonAncestorContainer.childNodes).get(i).replaceWith(repNode);
            } else {
                $(commonAncestorContainer.childNodes).get(i).style.background = "yellow";
            }
        }

        if (aNodeCopy.parentNode.isSameNode(fNodeCopy.parentNode)) {
            highlightIndividualNode(aOffCopy, aNodeCopy.textContent.length, aNodeCopy);
            highlightIndividualNode(0, fOffCopy, fNodeCopy);
            fNodeCopy.parentNode.removeChild(fNodeCopy);
            aNodeCopy.parentNode.removeChild(aNodeCopy);
        } else {


            /** "Finishing" the anchor */
            let aNodeParentChildNodeLength = aNodeCopy.parentNode.childNodes.length;
            //let aNodeInnerIndex = $(aNodeCopy.parentNode.childNodes).find(aNodeCopy);
            let aNodeInnerIndex = $(aNodeCopy.parentNode.childNodes).index(aNodeCopy);

            let aNodeEnd = $(aNodeCopy.parentNode.childNodes).get(aNodeParentChildNodeLength - 1);
            console.log("The aNodeEnd is " + aNodeEnd.textContent);
            console.log("The aNodeInnerIndex is " + aNodeInnerIndex + ". The aNodeParentChildNodeLength is " + aNodeParentChildNodeLength);

            if (!aNodeEnd.isSameNode(aNodeCopy)) {
                for (let i = aNodeInnerIndex + 1; i < aNodeParentChildNodeLength; i++) {
                    if ($(aNodeCopy.parentNode.childNodes).get(i).isSameNode(fNodeCopy) ||
                        $(aNodeCopy.parentNode.childNodes).get(i).contains(fNodeCopy)){
                        break;
                    }
                    else if ($(aNodeCopy.parentNode.childNodes).get(i).nodeType === Node.TEXT_NODE) {
                        let repNode = returnHighlightedSpan($(aNodeCopy.parentNode.childNodes).get(i));
                        $(aNodeCopy.parentNode.childNodes).get(i).replaceWith(repNode);
                    } else {
                        $(aNodeCopy.parentNode.childNodes).get(i).style.background = "yellow";
                    }
                }
            }


            /** "Finishing" the focus */
            let fNodeEndIndex = $(fNodeCopy.parentNode.childNodes).index(fNodeCopy);
            console.log("fNodeEndIndex: " + fNodeEndIndex);

            for (let i = fNodeEndIndex-1; 0 <= i; i--) {
                if ($(fNodeCopy.parentNode.childNodes).get(i).isSameNode(aNodeCopy) ||
                    $(fNodeCopy.parentNode.childNodes).get(i).contains(aNodeCopy)){
                    break;
                }
                else if ($(fNodeCopy.parentNode.childNodes).get(i).nodeType === Node.TEXT_NODE) {
                    let repNode = returnHighlightedSpan($(fNodeCopy.parentNode.childNodes).get(i));
                    $(fNodeCopy.parentNode.childNodes).get(i).replaceWith(repNode);
                } else {
                    $(fNodeCopy.parentNode.childNodes).get(i).style.background = "yellow";
                }
            }


            /** Highlights the anchorNode */
            highlightIndividualNode(aOffCopy, aNodeCopy.textContent.length, aNodeCopy);

            /** Highlights the focusNode */
            highlightIndividualNode(0, fOffCopy, fNodeCopy);

            /** We do not remove these nodes until the very end, and instead of using aNode and fNode, we use selection.anchorNode
             *  and selection.focusNode as we have since modified the aNode and fNodes */
            aNodeCopy.parentNode.removeChild(aNodeCopy);
            fNodeCopy.parentNode.removeChild(fNodeCopy);


            clearSelection();
        }
    }
}

/** Could be used to replace... fucking... everything? idk */
function swimUpFromNode(selection, aNode, fNode, swimNode){

    if (swimNode.isSameNode(selection.getRangeAt(0).commonAncestorContainer)){
        ;
    }
    else {
        $(swimNode.parentNode.childNodes).each(function(index, element){
            /** If aNode comes BEFORE element, which means that we should highlight it */
                if (aNode.compareDocumentPosition(element) === 4 && fNode.compareDocumentPosition(element) === 2){
                    /** Highlights the node */
                    highlightIndividualNodeSimple(node);
                }

            })
        swimUpFromNode(selection, aNode, fNode, swimNode.parentNode);

    }

}


function highlightIndividualNode(startOffset, endOffset, node){



    if (node.nodeType === Node.TEXT_NODE){
        /** Tentative */
        nodesToDelete.push(node);

        let highlightNode = returnHighlightedSpan(node.textContent.substring(startOffset, endOffset));
        highlightNode.style.background = "yellow";

        let beforeText = document.createTextNode(node.textContent.substring(0, startOffset));
        let afterText = document.createTextNode(node.textContent.substring(endOffset, node.textContent.length));

        let nodeParent = node.parentNode;
        nodeParent.insertBefore(beforeText, node);
        nodeParent.insertBefore(highlightNode, node);
        nodeParent.insertBefore(afterText, node);
        //nodeParent.removeChild(node);

        //selection.anchorNode =

    } else if (!node.hasChildNodes()){
        ;
    } else {
        $(node).contents().each(function(index, element){
            highlightIndividualNode(startOffset, endOffset, element);
        })
    }
}




function returnHighlightedSpan(textNode){
    let replacementNode = document.createElement("span");

    /** If // Else to allow both TextNode and String input */
    if (typeof textNode === 'string' || textNode instanceof String){
        let replacementText = document.createTextNode(textNode);
        replacementNode.appendChild(replacementText);
        replacementNode.style.background = "yellow";
        return replacementNode;
    }
    else {
        let replacementText = document.createTextNode(textNode.textContent);
        replacementNode.appendChild(replacementText);
        replacementNode.style.background = "yellow";
        return replacementNode;
    }
}

function clearSelection(){
    if (window.getSelection()){
        window.getSelection().removeAllRanges();
    }
}

/** COPIED FROM STACK OVERFLOW:
 https://stackoverflow.com/questions/34405888/how-can-i-test-which-node-comes-first */
function firstNode(node1, node2) {
    return node1.compareDocumentPosition(node2)
    & Node.DOCUMENT_POSITION_FOLLOWING ? node1 : node2;
}

function deleteNodes(){
    console.log("nodesToDelete.length: " + nodesToDelete.length);
    nodesToDelete.forEach(element => element.parentNode.removeChild(element))
}