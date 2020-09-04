var selection = window.getSelection();

selectionText = selection.toString();

selectionContainer = selection.getRangeAt(0).commonAncestorContainer;

containerTextContent = selectionContainer.textContent;

//alert("file has loaded");

console.log("container innerHTML: " + containerTextContent);
console.log(selectionContainer.hasChildNodes());

var startFound = false;
var focusDone = false;
var anchorDone = false;


scanContainerHelper(selectionContainer, selection, selectionContainer.parentNode);

//selectionContainer.parentNode.removeChild(selectionContainer.parentNode.firstChild);


/** setBaseAndExtent use:
 * Find either the anchor or focus node first
 * Use setBaseAndExtent and increment forwards until at the end of the selection and highlight each part individually
 * Start by doing selection.setBaseAndExtend(aNode, 0, fNode, 0);
 */

/** Here's what I'm thinking:
 *
 * 1. Use recursive scanContainerHelper to find anchor and focus nodes.
 * 2. Check if the anchor and focus nodes are the same. If they are, we get the easy way out
 *      a. Create a new element based on the focus/anchor's nodeType
 *      b. Use the anchor/focusOffset to add the first characters of the node (not the text to be highlighted) to the new element
 *      c. Add a new child to the element (or sibling? I'm not sure) with style.background = "yellow" (highlighted)
 *      d. Append the rest of the text to the element, then do container.replaceWith(element) and hopefully all the formatting will be good
 * 3. If not, somehow check which comes first (reading-wise): the anchor or the focus
 * 4. Create a new element (like in 2a.) using the commonAncestorContainer as reference
 * 5. To the same but seperate the anchor and focus into two separate nodeTypes
 *
 * @param element: the container we feed in (and use recursion to find the anchor / focus nodes */
function scanContainerHelper(element, selection, parentNode) {

    /** Used to iterate through the element's children */
    let childrenLength = parentNode.childNodes.length;
    let children = parentNode.childNodes;

    /** If the highlighted text is in one element */
    if (element === selection.anchorNode && element === selection.focusNode) {

        /** This changes the startOffset and endOffset if the user highlights from right to left (as opposed from left to right) */
        if (selection.anchorOffset > selection.focusOffset){
            var startOffset = selection.focusOffset;
            var endOffset = selection.anchorOffset;
        }
        else {
            var endOffset = selection.focusOffset;
            var startOffset = selection.anchorOffset;
        }

        iterateThroughParent(startOffset, endOffset, children, childrenLength, element, parentNode);

    }

    else if (element === selection.anchorNode) {

        //alert("found anchorNode");
        console.log(selection.anchorOffset);

        let elementCopy = element;

        /** This changes the startOffset and endOffset if the user highlights from right to left (as opposed from left to right) */
        /** Uses a startFound variable (unlike when the focNode and ancNode are the same */
        if (startFound){
            endOffset = selection.anchorOffset;
            startOffset = 0;
            console.log("Start has been found already. Here are the start and end offsets: " + startOffset + ", " + endOffset);
        }
        else {
            startFound = true;

            /** CHANGING THIS TO SEE IF IT FIXES IT... IT FUCKING FIXED IT!!!! */
            endOffset = selection.anchorNode.textContent.length;
            startOffset = selection.anchorOffset;
            console.log("Start has not been found yet. Here are the start and end offsets: " + startOffset + ", " + endOffset);
        }

        /** K should be i+3, which is the next element after the completed highlighted span */
        let k = iterateThroughParent(startOffset, endOffset, children, childrenLength, element, parentNode);

        //let k = i + 1;

        /** Highlights everything in between the anchor and focus */

        /** TODO: Highlighting messes up with bold (<b>) text. Implement alternative method of selecting nodes in between anchor and focus. */


        while (isNodeBetween(children[k], selection.focusNode) && k < childrenLength) {
            /** Finds the first text node in between the anchor and focus */
            let nodeToReplace = findTextNodeBetween(children[k], selection.focusNode);

            let replaceNode = returnHighlightedSpan(nodeToReplace);

            nodeToReplace.replaceWith(replaceNode);

            /** The while loop continues until it iterates to the focusNode (so there are no other nodes in between the anchor and focus */
            k++;
        }

        for (let i = 0; i < childrenLength; i++){
            console.log(children[i].textContent);
        }

/**
        alert(elementCopy.textContent);

        while (elementCopy && !nextSiblingIs(elementCopy, selection.focusNode)){
            alert("i got into the while loop")
            highlightNextSibling(elementCopy.nextSibling);
            elementCopy = elementCopy.nextSibling;
        }
*/

        /** Stops necessary scanning (when focusDone is also true) */
        anchorDone = true;
    }

    else if (element === selection.focusNode){

        //alert("found focusNode");

        if (startFound){
            endOffset = selection.focusOffset;
            startOffset = 0;
            console.log("Start has been found already. Here are the start and end offsets: " + startOffset + ", " + endOffset);
        }
        else {
            startFound = true;
            endOffset = selection.focusNode.textContent.length;
            startOffset = selection.focusOffset;
            console.log("Start has not been found yet. Here are the start and end offsets: " + startOffset + ", " + endOffset);
        }


        iterateThroughParent(startOffset, endOffset, children, childrenLength, element, parentNode);



        /** Stops necessary scanning (when anchorDone is also true) */
        focusDone = true;
    }
    else if (focusDone && anchorDone){
        /** Clears the user's selection once all the highlighting is done */
        clearSelection();
    }
    else if (element.hasChildNodes()) {
        for (let i = 0; i < element.childNodes.length; i++){
            scanContainerHelper(element.childNodes[i], selection, element);
        }
    }
    else {
        ;
    }
}

function is_all_ws( nod )
{
    // Taken from Mozilla HTML/JS API documentation
    // Use ECMA-262 Edition 3 String and RegExp features
    return !(/[^\t\n\r ]/.test(nod.textContent));
}

function iterateThroughParent(startOffset, endOffset, children, childrenLength, element, parentNode) {
    /** Iterate's through the parent's children and tries to find the element which matches the commonAncestorContainer */
    for (let i = 0; i < childrenLength; i++){

        /** If the current child is the cAC */
        if (children[i] === element){



            /** the text in the element before the selection */
            let beforeText = document.createTextNode(element.nodeValue.substring(0, startOffset));
            console.log(element.nodeValue.substring(0, startOffset));

            /** the selected text which we highlight in a nobr element */
            let highlightText = document.createTextNode(element.nodeValue.substring(startOffset, endOffset));
            console.log(element.nodeValue.substring(startOffset, endOffset));

            /** the nobr element and the highlighting (changing background color) */
            let highlightA = document.createElement("span");
            highlightA.style.background = "yellow";
            highlightA.appendChild(highlightText);

            /** the text after the highlight */
            let afterText = document.createTextNode(element.nodeValue.substring(endOffset));
            console.log(element.nodeValue.substring(endOffset));


            /** Insert the three different texts into the parent element and removing the old element after
             *  This preserves much of the HTML except for the highlighted element's.
             *  TODO: Make the highlight preserve the selection's special HTML (e.g. href links) */
            parentNode.insertBefore(beforeText, children[i]);
            parentNode.insertBefore(highlightA, children[i+1]);
            parentNode.insertBefore(afterText, children[i+2]);

            parentNode.removeChild(children[i+3]);

            /** RETURNS the next element after the highlighted span so we can go through the middle parts and highlight */
            return i+3;
            //alert("appending done");
        }
        else {
            ;
        }
    }
}







    /** Checks if there is another node between two given nodes */
    function isNodeBetween(node, compareNode) {

        let foundNode = false;
        let middleNode = null;

        isNodeBetweenHelper(node, compareNode)

        return !foundNode;


        function isNodeBetweenHelper(node, compareNode) {
            if (node === null || node === undefined) {
                ;
            } else if (node.isEqualNode(compareNode)) {
                foundNode = true;
                middleNode = node;
            } else if (!node.hasChildNodes()) {
                ;
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    isNodeBetweenHelper(node.childNodes[i], compareNode);
                }
            }
        }

    } 

    /** Used to find a text node in a parent node. Only called after isNodeBetween is true, so doesn't check */
    function findTextNodeBetween(node) {
        let betweenNode = null;
        findTextNodeBetweenHelper(node)

        return betweenNode;

        function findTextNodeBetweenHelper(node) {
            /**
            if (node === null || node === undefined) {
                ;
            } else */
                if (node.nodeType === Node.TEXT_NODE) {
                betweenNode = node;
            } else if (!node.hasChildNodes()) {
                ;
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    findTextNodeBetweenHelper(node.childNodes[i]);
                }
            }
        }
}

/** IGNORE THIS FUNCTION */
function nextSiblingIs(node, compareNode){
    /** This function is used to check if a node is adjacent to either the anchor/focus node.
     *  I have to take the childNode[0] of the node's immediate sibling because the anchor/focus node references
     *  a Node.TEXT_NODE, but just node.nextSibling refers to an HTML element like <a> or <p>.
     *  Thus, taking the first child of that element will give us the text node we need to make an accurate comparison.
     */
/**

    //alert(node.nodeType.toString() + " " + compareNode.nodeType.toString());
    if (node.nextSibling.childNodes[0].isEqualNode(compareNode)){
        alert("got true");
        return true;
    }
    else {
        return false;
    }
 */


    alert(node.nodeType.toString() + " " + compareNode.nodeType.toString());
    if (node.nextSibling.nodeType === Node.TEXT_NODE){
        if (node.nextSibling.isEqualNode(compareNode)){
            return true;
        }
        else {
            return false;
        }
    }
    else if (!node.hasChildNodes()){
        return false;
    }
    else {
        return nextSiblingIs(node.childNodes[0], compareNode);
    }


}

/** Function that bundles the element / text node creation process for my ease */
function returnHighlightedSpan(textNode){
    let replacementNode = document.createElement("span");
    let replacementText = document.createTextNode(textNode.textContent);
    replacementNode.appendChild(replacementText);
    replacementNode.style.background = "yellow";
    return replacementNode;
}

/** Highlights all text nodes in a given node */
function highlightNextSibling(sibling){
    if (sibling.nodeType === Node.TEXT_NODE){
        let repNode = returnHighlightedSpan(sibling);
        sibling.replaceWith(repNode);
    } else if (!sibling.hasChildNodes()) {
        ;
    }
    else {
        for (let i = 0; i < sibling.childNodes.length; i++) {
                highlightNextSibling(sibling.childNodes[i]);
        }
    }
}

/** If there is a selection, clear it. Used once highlighting is done */
function clearSelection(){
    if (window.getSelection()){
        window.getSelection().removeAllRanges();
    }
}


/**
function highlightBetweenNodesTest(commonContainer, startNode, endNode){
    let startNodeFound = false;
    let startParent;
    let endNodeFound = false;
    let endParent;
    let startPos = 0;



    for (; startPos < commonContainer.childNodes.length; startPos++){
        startParent = commonContainer.childNodes[startPos];
        goThroughContainersChildrenFindStart(commonContainer.childNodes[startPos], startNode);

        if (startNodeFound){
            break;
        }
    }

    let endPos = startPos;

    for (; endPos < commonContainer.childNodes.length; endPos++){
        endParent = commonContainer.childNodes[endPos];
        goThroughContainersChildrenFindEnd(commonContainer.childNodes[endPos], endNode);

        if (endNodeFound){
            break;
        }
    }

    alert("startPos: " + startPos + ", endPos: " + endPos);

    function goThroughContainersChildrenFindStart(commonContainerChild, startNode){
        while (!startNodeFound){
            if (commonContainerChild.isEqualNode(startNode)){
                startNodeFound = true;
            } else if (!commonContainerChild.hasChildNodes()){
                ;
            }
            else {
                for (let i = 0; i < commonContainerChild.childNodes.length; i++){
                    goThroughContainersChildrenFindStart(commonContainerChild.childNodes[i], startNode);
                }
            }
        }
    }

    function goThroughContainersChildrenFindEnd(commonContainerChild, endNode){
        while (!endNodeFound){
            if (commonContainerChild.isEqualNode(endNode)){
                endNodeFound = true;
            } else if (!commonContainerChild.hasChildNodes()){
                ;
            }
            else {
                for (let i = 0; i < commonContainerChild.childNodes.length; i++){
                    goThroughContainersChildrenFindEnd(commonContainerChild.childNodes[i], endNode);
                }
            }
        }
    }
}
*/