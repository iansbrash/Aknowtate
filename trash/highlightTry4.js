selection = window.getSelection();
selectionText = selection.toString();
//selectionContainer = selection.getRangeAt(0).commonAncestorContainer;
//containerTextContent = selectionContainer.textContent;
//containerParent = selectionContainer.parentNode;

nodesToDelete = new Array();

jQueryIndexHighlight(selection);
//cantWriteOnPaper(selection, selection.getRangeAt(0).commonAncestorContainer, selection.anchorNode, selection.focusNode);
//highlightTest(selection, selectionContainer);


//searchForNode(selectionContainer, selection.anchorNode);


/* So

Get a list of text nodes and element nodes. Or make a copy of the ancestorContainer and strip all non TEXT_NODE HTML
elements from it so it is just plain text?


 */


/** IDEAS:
 * Start by taking the anchorNode and focusNode and calling their parentNode function until each of them reaches the commonAncestorContainer
 * Then use jQuery get() and index() functions to find the distance between the two
 * Do something similar to highlightTextBetween where it is precise near the anchor/focus nodes, but just highlights everything in between.
 *
 */



function jQueryIndexHighlight(selection){

    let aOff = selection.anchorOffset;
    let fOff = selection.focusOffset;

    let aNode = selection.anchorNode;
    let fNode = selection.focusNode;

    let commonAncestorContainer = selection.getRangeAt(0).commonAncestorContainer;

    if (aNode.isSameNode(fNode)){

        /** Swaps anchorOffset and focusOffset if user highlights from right to left (instead of rtl) */
        if (aOff > fOff){
            aOff = selection.focusOffset;
            fOff = selection.anchorOffset;
        }



        highlightIndividualNode(aOff, fOff, aNode);

        deleteNodes();
        //aNode.parentNode.removeChild(aNode);
    }
    else {
        /** Compares the focus and anchor.
         *  Changes the a/f Node/Off variables as needed if user highlights from right to left */
        if (firstNode(aNode, fNode) === aNode){
            ;
        }
        else {
            aNode = selection.focusNode;
            fNode = selection.anchorNode;

            aOff = selection.focusOffset;
            fOff = selection.anchorOffset;
        }

        let aNodeCopy = aNode;
        let fNodeCopy = fNode;
        let aOffCopy = aOff;
        let fOffCopy = fOff;

        /** SOME IDEAS BECAUSE I CAN'T WRITE ON PAPER
         * function cantWriteOnPaper(commonAncestorContainer){
         * Start with the commonAncestorContainer and get its childNodes.
         *      Check if either the anchorNode or focusNode or both are in the childNodes
         *          If the anchor ORR focusNode is in the cAC's childNodes:
         *              Get the aNodeIndex with respect to the cAC's childNodes
         *              At the index, do the highlightIndividualNode
         *              From the index+1 and onwards, highlightIndividualNode until reached the end of the cAC childNodes
         *                  Could be like: $(cAC.childNodes).each(function(index, element) {
         *                      highlightIndividualNode(element);
         *                  }) -- aka very simple stuff
         *              Done
         *          Else if the anchorNode AND focusNode are both in the childNodes
         *              Get the aNodeIndex and fNodeIndex -- do the selective highlight on both.
         *              For loop through their indices and highlightIndividualNode each element it iterates through
         *              Done. Easy.
         *          Else if neither the anchorNode nor focusNode are in the cAC.childNodes
         *              Use recursion and complete the whole process over again but with the cAC.childNodes.childNodes, ya feel?
         *                  Something like: $(cAC.childNodes).each(function(index, element){
         *                      cantWriteOnPaper(element);
         *                      Done. Seems pretty simple as well.
         *                  }
         * }
         *
         */



        /** Swims each node up to one level below the commonAncestorContainer
         *  NOTE: This method of highlighting ONLY WORKS when the aNode and fNode is different */
        while (!aNode.parentNode.isSameNode(commonAncestorContainer)){
            aNode = aNode.parentNode;
        }
        while (!fNode.parentNode.isSameNode(commonAncestorContainer)){
            fNode = fNode.parentNode;
        }



        /** Indices used to highlight the text in between the nodes */
        let aNodeIndex = Math.abs($(commonAncestorContainer.childNodes).index(aNode));
        let fNodeIndex = Math.abs($(commonAncestorContainer.childNodes).index(fNode));
        console.log("aNodeIndex: " + aNodeIndex);
        console.log("fNodeIndex: " + fNodeIndex);



        /** Iterates through all the "surface-level" nodes in between the aNode and fNode and highlights them */
        for (let i = aNodeIndex+1; i < fNodeIndex; i++){
            if ($(commonAncestorContainer.childNodes).get(i).nodeType === Node.TEXT_NODE){
                let repNode = returnHighlightedSpan($(commonAncestorContainer.childNodes).get(i));
                $(commonAncestorContainer.childNodes).get(i).replaceWith(repNode);
            } else {
                $(commonAncestorContainer.childNodes).get(i).style.background = "yellow";
            }
        }


        /** NOTE: Both of these methods don't fully highlight the "end" of the anchorChild */

        let aNodeSibling = aNodeCopy;
        let aNodeParentChildNodeLength = aNodeSibling.parentNode.childNodes.length;

        let aNodeEnd = $(aNodeSibling.parentNode.childNodes).get(aNodeParentChildNodeLength-1);
        console.log("The aNodeEnd is " + aNodeEnd.textContent);
        /**
        let startIndex = $(aNodeCopy.parentNode.childNodes).find(aNodeCopy);
        startIndex++;
        for (; startIndex < aNodeParentChildNodeLength; startIndex++){
            aNodeSibling = $(aNodeCopy.parentNode.childNodes).get(startIndex);
            highlightIndividualNode(0, aNodeSibling.textContent.length, aNodeSibling);
            console.log("Highlighted " + aNodeSibling.textContent);
        } */
        if (!aNodeEnd.isSameNode(aNodeCopy)){
            do {
            aNodeSibling = aNodeSibling.nextSibling;
            highlightIndividualNode(0, aNodeSibling.textContent.length, aNodeSibling);
            console.log("Highlighted " + aNodeSibling.textContent);

            } while (!aNodeSibling.isSameNode(aNodeEnd));
            //aNodeSibling.parentNode.removeChild(aNodeSibling.previousSibling);
        }



        /** Highlights the anchorNode */
        highlightIndividualNode(aOffCopy, aNodeCopy.textContent.length, aNodeCopy);

        /** Highlights the focusNode */
        highlightIndividualNode(0, fOffCopy, fNodeCopy);




        /** We do not remove these nodes until the very end, and instead of using aNode and fNode, we use selection.anchorNode
         *  and selection.focusNode as we have since modified the aNode and fNodes */
        //aNodeCopy.parentNode.removeChild(selection.anchorNode);
        //fNodeCopy.parentNode.removeChild(selection.focusNode);
        deleteNodes();
    }
}


/** This function is initially used with the commonAncestorContainer, but recurses with the cAC's childNodes, etc */
function cantWriteOnPaper(selection, parent, aNode, fNode){
    /** SOME IDEAS BECAUSE I CAN'T WRITE ON PAPER
     * function cantWriteOnPaper(commonAncestorContainer){
     * Start with the commonAncestorContainer and get its childNodes.
     * We use some sort of contains() function to check if the parent contains both (as the aNode and fNode might be on different levels)
     * ^ Maybe use compareDocumentPosition to see if both aNode and fNode are contained within each of the parent's childNode
     *      Check if either the anchorNode or focusNode or both are in the childNodes
     *          If the anchor ORR focusNode is in the cAC's childNodes:
     *              Get the aNodeIndex with respect to the cAC's childNodes
     *              At the index, do the highlightIndividualNode
     *              From the index+1 and onwards, highlightIndividualNode until reached the end of the cAC childNodes
     *                  Could be like: $(cAC.childNodes).each(function(index, element) {
     *                      highlightIndividualNode(element);
     *                  }) -- aka very simple stuff
     *              Done
     *          Else if the anchorNode AND focusNode are both in the childNodes
     *              Get the aNodeIndex and fNodeIndex -- do the selective highlight on both.
     *              For loop through their indices and highlightIndividualNode each element it iterates through
     *              Done. Easy.
     *          Else if neither the anchorNode nor focusNode are in the cAC.childNodes
     *              Use recursion and complete the whole process over again but with the cAC.childNodes.childNodes, ya feel?
     *                  Something like: $(cAC.childNodes).each(function(index, element){
     *                      cantWriteOnPaper(element);
     *                      Done. Seems pretty simple as well.
     *                  }
     * }
     *
     */

    let childNodes = parent.childNodes;


    $(childNodes).each(function(index, element){
        if (element.isSameNode(aNode)){
            highlightIndividualNode(selection.anchorOffset, aNode.textContent.length, aNode);
        }
        else if (element.isSameNode(fNode)){


        }
        /** e.cDP(aNode) < 4 means e appears after aNode. e.cDP(fNode) < 8 means e appears before fNode */
        else if (element.compareDocumentPosition(aNode) < 4 && element.compareDocumentPosition(fNode) < 8){
            if (element.nodeType === Node.TEXT_NODE){
                let repTextNode = returnHighlightedSpan(element)
                element.replaceWith(repTextNode);
            } else {
                element.style.background = "yellow";
            }

        }
        else {
            cantWriteOnPaper(selection, element, aNode, fNode);
        }
    });
}


/**
function highlightTestAbove(selection){
    let commonAncestorContainer = selection.getRangeAt(0).commonAncestorContainer;

    //alert(commonAncestorContainer.textContent);


    let aNode = selection.anchorNode;
    let fNode = selection.focusNode;

    while (!aNode.parentNode.isSameNode(commonAncestorContainer)){
        aNode = aNode.parentNode;
    }

    while (!fNode.parentNode.isSameNode(commonAncestorContainer)){
        fNode = fNode.parentNode;
    }
    //alert($(aNode).get(-1).textContent);

    //alert($(aNode).index(fNode));

    for (let i = 0; i < 5; i++) {
        console.log($(commonAncestorContainer).contents().get(i));
    }

    let aNodeIndex = $(commonAncestorContainer).contents().index(aNode);
    let fNodeIndex = $(commonAncestorContainer).contents().index(fNode);

    let indexDifference = fNodeIndex - aNodeIndex;
    alert(indexDifference);

    //console.log($(commonAncestorContainer).find(selection.anchorNode).get(1).innerHTML);

} */




function highlightTest(selection, selectionContainer){




    //alert(selectionContainer.textContent);

    let aOff = selection.anchorOffset;
    let fOff = selection.focusOffset;



    let aNode = selection.anchorNode;
    let fNode = selection.focusNode;

    let cAC = selection.getRangeAt(0).commonAncestorContainer;





    if (aNode.isSameNode(fNode)){

        /** Swaps anchorOffset and focusOffset if user highlights from right to left (instead of rtl) */
        if (aOff > fOff){
            aOff = selection.focusOffset;
            fOff = selection.anchorOffset;
        }



        highlightIndividualNode(aOff, fOff, aNode);

        //aNode.parentNode.removeChild(aNode);
    }
    else {


        /** Compares the focus and anchor.
         *  Changes the a/f Node/Off variables as needed if user highlights from right to left */
        if (firstNode(aNode, fNode) === aNode){
            ;
        }
        else {
            aNode = selection.focusNode;
            fNode = selection.anchorNode;

            aOff = selection.focusOffset;
            fOff = selection.anchorOffset;
        }



        /** Highlights the anchorNode */
        highlightIndividualNode(aOff, aNode.textContent.length, aNode);


        /** If the anchorNode is at the end of the sibling line, relocates the
         *  highlightTextBetween starting position to the aNode's parent's nextSibling's firstChild */
        let anchorSibling;
        if (aNode.nextSibling){
            anchorSibling = aNode.nextSibling;
        } else {

            /** Checks if getting the parent node is a legal operation (which is needs to be) */
            if (!aNode.parentNode){
                alert("aNode didn't have a parent node when making the transition from highlightIndividualNode to highlightTextBetween");
            } else {

                anchorSibling = aNode.parentNode;


                if (anchorSibling.nextSibling){
                    anchorSibling = anchorSibling.nextSibling;
                    while (!anchorSibling.firstChild){
                        /** If anchorSibling doesn't have children, go to the next sibling and repeat */
                        anchorSibling = anchorSibling.nextSibling;
                    }
                    anchorSibling = anchorSibling.firstChild
                } else {
                    alert("Got aNode's parent, but there were no siblings left (probably at the end of the document?");
                }

            }


            //anchorSibling = aNode.parentNode.nextSibling.firstChild;
        }



        highlightTextBetween(anchorSibling, fNode);


        highlightIndividualNode(0, fOff, fNode);

        /** Removes the anchor node. This was originally before highlightTextBetween, might relocate this before fNode.remove() */
        aNode.parentNode.removeChild(aNode);
        /** Removes the fNode at the end */
        fNode.parentNode.removeChild(fNode);
    }

    //highlightTextBetween(aNode, fNode);
    //highlightIndividualNode(aOff, fOff, fNode);
}




/** Functions I need to create:
 *
 * highlightTextBetween: highlights text between two nodes (anchor and focus)
 *      Potential problems: What if commonAncestorContainer spans over the entire document, i.e. parent of a paragraph on wikipedia
 * highlightIndividualNode: highlights the text in a node given an anchorOffset and focusOffset and a node. Used for "capping up" the hightlight
 */


/** Problem with this:
 * Sometimes, the anchor/focus node is a text node, which isn't on the same "level" as everything else, and thus, it has no children
 */

function highlightTextBetween(startNode, endNode){



    let currentNode = startNode;

    /** Just added this in case the startNode is at the very end of an element (i.e. a paragraph jump) */
    /**
    if (currentNode.nextSibling){
        currentNode = currentNode.nextSibling;
    }
    else {
        currentNode = currentNode.parentNode.nextSibling.firstChild;
    } */


    highlightTextBetweenHelper(currentNode,endNode);

    clearSelection();
}

/** Originally starts as the startNode's nextSibling, then recurses until it lands on the endNode */
function highlightTextBetweenHelper(currentNode, endNode){

    //let specialCase = false;


    while (!currentNode.isSameNode(endNode)) {

        if (currentNode.nodeType === Node.TEXT_NODE) {
            let repNode = returnHighlightedSpan(currentNode);
            currentNode.parentNode.insertBefore(repNode, currentNode);
            console.log("found a text node");

            /** This SEEMS to work because I'm testing on Wikipedia which has non-TEXT_NODE nodes at the end of each paragraph, so my
             * bad code here doesn't matter. */
            if (!currentNode.nextSibling){

                /** in special cases, the node that is removed below is the anchor which messes up a lot of stuff. */

                //specialCase = true;

                //currentNode.parentNode.removeChild(currentNode.previousSibling);




                let temp = currentNode.parentNode.nextSibling.firstChild;
                currentNode.parentNode.removeChild(currentNode);
                currentNode = temp;

                //currentNode = currentNode.parentNode.nextSibling.firstChild;
                //currentNode.parentNode.removeChild(currentNode.parentNode.previousSibling.lastChild);

                //currentNode.parentNode.removeChild(currentNode.previousSibling);
                break;
            }
            currentNode = currentNode.nextSibling;
            currentNode.parentNode.removeChild(currentNode.previousSibling);
        }
        else {
            currentNode.style.background = "yellow";
            if (!currentNode.nextSibling){
                break;
            }
            currentNode = currentNode.nextSibling;
        }
    }


    if (!currentNode.isSameNode(endNode)){
        /**
        if (specialCase){
            specialCase = false;
            highlightTextBetweenHelper(currentNode, endNode);
        } else {
        */

        /**
        while (!currentNode.nextSibling){
            console.log("currentNode.textContent: " + currentNode.textContent);
            currentNode = currentNode.parentNode;
        }
        console.log("currentNode.nextSibling.textContent: " + currentNode.nextSibling.textContent);
         */

        //console.log(currentNode.textContent);
        //console.log(currentNode.parentNode.textContent);
        //console.log(currentNode.parentNode.nextSibling.textContent);
            //currentNode = currentNode.parentNode.nextSibling.firstChild;
        //alert(currentNode.nextSibling.nodeType);

/** It seems shit gets wacky when going between paragraph elements, where the next paragraph's first element is a Text Node */


/**
        while (!currentNode.parentNode.isSameNode(containerParent)){
            currentNode = currentNode.parentNode;
        } */

        //currentNode = currentNode.nextSibling;

        //alert(currentNode.textContent + currentNode.nodeType);

        if (currentNode.nodeType === Node.TEXT_NODE){
            ;
        } else {
            ;//currentNode = currentNode.firstChild;
        }
            highlightTextBetweenHelper(currentNode, endNode);
        //}

    }
}

function highlightIndividualNodeSimple(node){
    if (node.nodeType === Node.TEXT_NODE) {
        /** Tentative */
        nodesToDelete.push(node);

        let highlightNode = returnHighlightedSpan(node);
        highlightNode.style.background = "yellow";
    }
    else {
        nodesToDelete.push(node);
        node.style.background = "yellow";
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



function searchForNode(nodeToBeSearched, targetNode){


    /**
    let startType = selection.anchorNode.nodeType;
    let endType = selection.focusNode.nodeType;

    let anchorNextSib = selection.anchorNode.nextSibling;
    let focusPrevSib = selection.focusNode.previousSibling;

    let startFound = false;
    let endFound = false;

    /** 3 is Node.TEXT_NODE, 1 is an element */

    /**
    //let targetType = targetNode.nodeType;
    let textList = $(nodeToBeSearched).get();
    let elementList = $(nodeToBeSearched).find("*");
    let startSib;
    */



    let currentSib = selection.anchorNode;


    if (selection.anchorNode.isSameNode(selection.focusNode)){



        let startOffset = selection.anchorOffset;
        let endOffset = selection.focusOffset;


        highlightEndText(containerParent, startOffset, endOffset);
    }
    else {




        let startOffset = selection.anchorOffset;
        let endOffset = selection.anchorNode.textContent.length;


        highlightIndividualNode(startOffset, selection.anchorNode.textContent.length, selection.anchorNode);

        //highlightEndText(containerParent, startOffset, endOffset);

        currentSib = currentSib.nextSibling;

        while (!currentSib.isSameNode(selection.focusNode)) {
            if (currentSib.nodeType === Node.TEXT_NODE) {
                let repNode = returnHighlightedSpan(currentSib);
                currentSib = currentSib.nextSibling;
                currentSib.previousSibling.replaceWith(repNode);
                console.log("found a text node");
            }
            else {
                currentSib.style.background = "yellow";
                currentSib = currentSib.nextSibling;
            }

        }

        highlightIndividualNode(0, selection.focusOffset, selection.focusNode);
/**
        startOffset = 0
        endOffset = selection.focusOffset;


        highlightEndText(containerParent, startOffset, endOffset);   */

    }


    /**
    if (startType === Node.TEXT_NODE){
        alert("start is text node");
        $(textList).contents().each(function (index, element){
            if (element.isSameNode(selection.anchorNode)){
                alert("found start node");
                startSib = element.nextSibling;
            }
    });



    $(textList).contents().each(function (index, element){
        if (element.nodeType === Node.TEXT_NODE){
            console.log(element.textContent);
        }

    }) */
}


function highlightEndText(containerParent, startOffset, endOffset){
    $(containerParent).contents().each(function (index, element) {

        if (element.isEqualNode(selection.anchorNode)){


            let startOffset = selection.anchorOffset;
            let endOffset = selection.focusOffset;

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

            containerParent.insertBefore(beforeText, element);
            containerParent.insertBefore(highlightA, element);
            containerParent.insertBefore(afterText, element);

            containerParent.removeChild(element);

        }
    })
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