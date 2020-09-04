/** This function contains all its helper functions as we should never want to use the helper functions outside of this context. */
function highlightViaSwim(selection, container, anchorNode, focusNode, anchorOffset, focusOffset, highlightColor, uniqueId, hasCorrectedOffsets){
    console.log("highlightViaSwim called");
    console.log("anchorNode.parentNode.hasChildNodes(): " + anchorNode.parentNode.hasChildNodes());

    console.log("container.textContent: " + container.textContent);
    console.log("container.parentNode.textContent: " + container.parentNode.textContent);


    /** Instantiates variables */
    let aOff, fOff, aNode, fNode, commonAncestorContainer, color, uniqueID;

    /** If all parameters are present and not null/undefined */
    if (container && anchorNode && focusNode && anchorOffset && focusOffset && highlightColor && uniqueId){
        aOff = anchorOffset;
        fOff = focusOffset;

        aNode = anchorNode;
        fNode = focusNode;

        commonAncestorContainer = container;

        color = highlightColor;

        uniqueID = uniqueId;
    }
    /** If some parameters are not present, attempts to replace them. This should not happen */
    else {
        console.log("variables were not provided for the highlightViaSwim method.");
        console.log("THIS SHOULD NOT HAPPEN");
        if (!anchorNode){
            console.log("Missing anchorNode... attempting to replace.");
            aNode = selection.anchorNode;

        }
        if (!focusNode){
            console.log("Missing focusNode... attempting to replace.");
            fNode = selection.focusNode;

        }
        if (!container){
            console.log("Missing container... attempting to replace.");
            commonAncestorContainer = selection.getRangeAt(0).commonAncestorContainer;
        }
        if (!anchorOffset){
            console.log("Missing anchorOffset... attempting to replace.");
            //aOff = selection.anchorOffset;
            /** The anchorOffset is usually missing when it is zero... */
            aOff = 0;
        }
        if (!focusOffset){
            console.log("Missing focusOffset... attempting to replace.");
            //fOff = selection.focusOffset;
            /** The focusOffset is usually missing when it is zero... */
            fOff = 0;
        }
        if (!highlightColor){
            console.log("Missing color... replacing with yellow");
            color = "yellow";
        }
        if (!uniqueId){
            console.log("Missing uniqueId... replacing with Date.now()");
            uniqueID = Date.now();
        }
    }

    /** Not sure if this really does anything. Gonna leave it for now */
    if (typeof aNode === "undefined"){
        console.log("Detected that aNode is typeof undefined. Replacing with window.getSel().aNode");
        aNode = window.getSelection().anchorNode;
        console.log("aNode textContent: " + aNode.textContent);
    }
    if (typeof fNode === "undefined"){
        console.log("Detected that fNode is typeof undefined. Replacing with window.getSel().fNode");
        fNode = window.getSelection().focusNode;
        console.log("fNode textContent: " + fNode.textContent);
    }

    /** Some console logging */
    console.log("aNode.textContent: " + aNode.textContent);
    console.log("aNode.parentNode.hasChildNodes(): " + aNode.parentNode.hasChildNodes());
    console.log("aNode.compareDocumentPosition(commonAncestorContainer): " + (aNode.compareDocumentPosition(commonAncestorContainer)));
    console.log("aNode.compareDocumentPosition(aNode.parentNode): " + (aNode.compareDocumentPosition(aNode.parentNode)));
    console.log("aNode.compareDocumentPosition(fNode): " + (aNode.compareDocumentPosition(fNode)));


    /** If the selection is contained within one node (e.g. highlighting the middle of a sentence with no special HTML */
    if (aNode.isSameNode(fNode)) {
        /** Swaps anchorOffset and focusOffset if user highlights from right to left (instead of rtl) */
        if (aOff > fOff) {
            let temp = aOff;
            aOff = fOff;
            fOff = temp;
        }
        highlightIndividualNode(aOff, fOff, aNode, true);

        /** Adds an anchor to the doc to jump between highlights */ /**
        let anchor = document.createElement("a");
        anchor.id = "highlightAnchor " + uniqueID;
        $(anchor).insertAfter(aNode); */

        /** Removes old aNode/fNode */
        aNode.parentNode.removeChild(aNode);
        clearSelection();
    }
    /** In the case that the selection spans over multiple nodes */
    else {
        /** Compares the focus and anchor.
         *  Changes the a/f Node/Off variables as needed if user highlights from right to left */
        if (firstNode(aNode, fNode) === aNode) {
            ;
        } else {
            let tempNode = aNode;
            aNode = fNode;
            fNode = tempNode;

            let tempOff = aOff;
            aOff = fOff;
            fOff = tempOff;
        }

        /** Makes copies of the nodes so we can reference them later after swimming/sinking through the nodes */
        let aNodeCopy = aNode;
        let fNodeCopy = fNode;
        let aOffCopy = aOff;
        let fOffCopy = fOff;

        console.log("About to call siwmUpFromNode");
        console.log("seelctio.textContent: " + selection.textContent);


        /** Used function from stackOverflow to do this because I am too lazy to keep tweaking the findElementFromDocument function or whatever tf its called */
        commonAncestorContainer = get_common_ancestor(aNode, fNode);

        /** Explained at function */
        swimUpFromNode(selection, aNode, fNode, aNode);

        /** Highlights the anchorNode */
        highlightIndividualNode(aOffCopy, aNodeCopy.textContent.length, aNodeCopy, true);

        /** Highlights the focusNode */
        highlightIndividualNode(0, fOffCopy, fNodeCopy, true);



        /** Use the copies to remove themselves as we have since edited the aNode and fNode variables to be something else */
        aNodeCopy.parentNode.removeChild(aNodeCopy);
        fNodeCopy.parentNode.removeChild(fNodeCopy);

        clearSelection();
    }


    /**
     * This function, paired with swimDownFromNode, does all the highlighting in between the aNode and fNode.
     *  I'm honestly too fucking lazy to thoroughly to explain how this works.
     *  The gist is it starts at the aNode, then tests all of its siblings to see if they are both after the aNode and before the fNode
     *  If they're in the middle, it calls the swimDown function which pretty much gets to the very bottom of that sibling's DOM tree (where the text nodes are)
     *  and replaces said text nodes with a span with style.background set to color.
     *  After doing this, it takes the node we started this paragraph with, and gets its parent. Then it calls the same function on the parent.
     *  So in conclusion, it swims up and down, comparing the nodes' positions it swims to to the aNode and fNode, and highlights accordingly... like the function's name implies.
     */
    function swimUpFromNode(selection, aNode, fNode, swimNode){

        /** TENTATIVE: changing selection.getRangeAt(0).commonAncestorContainer to container */
        if (swimNode.isSameNode(commonAncestorContainer)){
            ;
        }
        else {
            $(swimNode.parentNode.childNodes).each(function(index, element){
                /** If aNode comes BEFORE element, which means that we should highlight it */
                if (aNode.compareDocumentPosition(element) === 4 &&
                    (fNode.compareDocumentPosition(element) === 2 || fNode.compareDocumentPosition(element) === 10)){
                    /** Highlights the node */
                    swimDownFromNode(aNode, fNode, element);
                }
            })
            swimUpFromNode(selection, aNode, fNode, swimNode.parentNode);
        }
    }

    /** Read swimUpFromNode */
    function swimDownFromNode(aNode, fNode, sinkNode){
        if (sinkNode.nodeType === Node.TEXT_NODE &&
            (aNode.compareDocumentPosition(sinkNode) === 4 &&
                (fNode.compareDocumentPosition(sinkNode) === 2 || fNode.compareDocumentPosition(sinkNode) === 10))){

            /** Got whitespace checking from:
             * https://stackoverflow.com/questions/1172206/how-to-check-if-a-text-is-all-white-space-characters-in-client-side */
            if (sinkNode.textContent.trim().length == 0){
                ;
            }
            else {
                console.log("Attempting to highlight a node via swimDownFromNode")
                let repNode = returnHighlightedSpan(sinkNode);
                sinkNode.replaceWith(repNode);
            }
        }
        else if (!sinkNode.hasChildNodes()){
            ;
        } else {
            $(sinkNode.childNodes).each(function(index, element){
                swimDownFromNode(aNode, fNode, element);
            })
        }
    }


    /** Highlights a node. Called to highlight the aNode and fNode, and in swimDown and swimUp to highlight everything in between */
    function highlightIndividualNode(startOffset, endOffset, node, isAnchorNodeAndFocusNodeSameNode){
        /** Use this to highlight the beginning/end of highlight. This does the same thing but wraps the whole thing in another span to preserve DOM structure */
        if (node.nodeType === Node.TEXT_NODE){

            let highlightNode = returnHighlightedSpan(node.textContent.substring(startOffset, endOffset));


            /** Creates the popupSpan that I previously used. Trying to remove this now... never mind */
            let popupSpan = document.createElement("span");
            popupSpan.className = "popupSpan " + uniqueID;
            highlightNode.insertBefore(popupSpan, highlightNode.firstChild);

            /** Sets the classname for easy selection / removal */
            highlightNode.className = highlightClassName + " " + uniqueID;

            let beforeText = document.createTextNode(node.textContent.substring(0, startOffset));
            let afterText = document.createTextNode(node.textContent.substring(endOffset, node.textContent.length));

            let nodeParent = node.parentNode;


            /** This part right here actually helps a ton. If a highlight is deleted before another, and they DO NOT SHARE THE SAME NODE, the second highlight still works. */
            if (isAnchorNodeAndFocusNodeSameNode && node.parentNode.className != "aknowtateDOMSaver"){
                console.log("FIRST IF STATEMENT: isAnchorNodeAndFocusNodeSameNode && node.parentNode.className != \"aknowtateDOMSaver\"")
                console.log("node.textContent: " + node.textContent);

                let bigWrapper = document.createElement("span");
                bigWrapper.className = "aknowtateDOMSaver";

                bigWrapper.appendChild(beforeText);
                bigWrapper.appendChild(highlightNode);
                bigWrapper.appendChild(afterText);
                nodeParent.insertBefore(bigWrapper, node);
            }
            else if (!hasCorrectedOffsets && isAnchorNodeAndFocusNodeSameNode && node.parentNode.className === "aknowtateDOMSaver") {
                /** Needs to count each previous siblings' textContent.length to get correct anchor/focusOffset */
                /** ... Calculate an "absolute" anchor/focusOffset... if the parentNode is of aknowtateDOMSaver... */

                console.log("FIRST ELSEIF STATEMENT: !hasCorrectedOffsets && isAnchorNodeAndFocusNodeSameNode && node.parentNode.className === \"aknowtateDOMSaver\"");

                let pNode = node.parentNode;

                console.log("pNode.className: " + pNode.className);
                console.log("In the first else if statement... the one im working on... i dont even know what node is");
                console.log("node.textContent: " + node.textContent);
                console.log("pNode.textContent before doing everything: " + pNode.textContent);
                console.log("this is very important... anchorOffset: " + anchorOffset);

                let absoluteStartOffset = 0;

                $(pNode.childNodes).each((index, element) => {
                        if (element === node){
                            console.log("Found element in seocnd eelse if statement");
                            console.log("element.textContent: " + element.textContent + ", node.textContent: " + node.textContent);
                            return false;
                        }
                        else {
                            absoluteStartOffset += element.textContent.length;
                            console.log("AbsoluteOffset: " + absoluteStartOffset + ", element.textContent.length: " + element.textContent.length);
                        }
                    })

                console.log("pNode.textContent: " + pNode.textContent);

                console.log("About to do absoluteOffset += anchorOffset... here is the current anchorOffset: " + anchorOffset);
                let absoluteEndOffset = absoluteStartOffset + endOffset;
                absoluteStartOffset += anchorOffset;

                console.log("new absolute offset: " + absoluteStartOffset);
                console.log("pNode.textContent before storage call: " + pNode.textContent);

                /*
                beforeText = document.createTextNode(pNode.textContent.substring(0, absoluteOffset));
                afterText = document.createTextNode(pNode.textContent.substring(absoluteFocusOffset, pNode.textContent.length));
                highlightNode = returnHighlightedSpan(pNode.textContent.substring(absoluteOffset, absoluteFocusOffset));

                 */


                pNode.insertBefore(beforeText, node);
                pNode.insertBefore(highlightNode, node);
                pNode.insertBefore(afterText, node);




                /** This block of code seems to fuck up the pNode's sturcture somehow... no idea why */
                chrome.storage.sync.get(window.location.href, function (values) {
                    console.log("pNode.textContent after storage call: " + pNode.textContent);
                    let highlights = values[window.location.href];

                    let indexToEdit = 0;

                    $(highlights).each(function (index, element) {
                        if (element.uniqueID === uniqueId){
                            indexToEdit = index;
                            console.log("Found the specific highlight we need to edit! ID: " + element.uniqueID);
                            return 0;
                        }
                    })


                    /** This returns incorrectly... */
                    console.log("pNode.textContent, this errs: " + pNode.textContent);

                    highlights[indexToEdit].anchorOffset = absoluteStartOffset;
                    highlights[indexToEdit].focusOffset = absoluteEndOffset;
                    highlights[indexToEdit].hasCorrectedOffsets = true;

                    chrome.storage.sync.set({[window.location.href]: highlights}, function () {
                        console.log("Holy shit that was a long ass process. Jesus. Just finished the special case absolute offset finding function");
                        console.log("pNode.textContent after doing eveyrthing: " + pNode.textContent);
                        console.log("node.textContent: " + node.textContent);
                        console.log("pNode.parentNode.textContent: " + pNode.parentNode.textContent);


                    })
                })


            } else if (isAnchorNodeAndFocusNodeSameNode && node.parentNode.className === "aknowtateDOMSaver"){

                console.log("SECOND ELSEIF STATEMENT: isAnchorNodeAndFocusNodeSameNode && node.parentNode.className === \"aknowtateDOMSaver\"");

                let beforeLength = 0;

                console.log("here is the startOffset we're working with. In the second ELSE IF statement: " + startOffset);

                $(node.parentNode.childNodes).each(function (index, element) {
                    console.log("Trying to calculate where to highlight based off of the given ABSOLUTEoffset.");
                    console.log("element.textcontent.legnth : " + element.textContent.length + ", beforeLength: " + beforeLength);
                    console.log("element.textContent: " + element.textContent);
                    if (element.textContent.length + beforeLength > startOffset){
                        return false;
                    } else {
                        beforeLength += element.textContent.length
                    }
                })
                console.log("exited jquery each");
                console.log("node.textContent; " + node.textContent);
                console.log("node.parentNode.textContent: " + node.parentNode.textContent);
                console.log("beforeLength: " + beforeLength + ", startOffset: " + startOffset);

                beforeLength = startOffset - beforeLength;
                let afterLength = beforeLength + (endOffset - startOffset);

                console.log("beforeLength after substraction: " + beforeLength);

                beforeText = document.createTextNode(node.textContent.substring(0, beforeLength));
                afterText = document.createTextNode(node.textContent.substring(afterLength, node.textContent.length));
                highlightNode = returnHighlightedSpan(node.textContent.substring(beforeLength, afterLength));

                /** Creates the popupSpan that I previously used. Trying to remove this now... never mind */
                let popupSpan = document.createElement("span");
                popupSpan.className = "popupSpan " + uniqueID;
                highlightNode.insertBefore(popupSpan, highlightNode.firstChild);


                nodeParent.insertBefore(beforeText, node);
                nodeParent.insertBefore(highlightNode, node);
                nodeParent.insertBefore(afterText, node);
            }
            else {
                console.log("ELSE STATEMENT: At the very end. At the else. you should see this whenthe offset is kinda fked ")

                /*
                beforeText = document.createTextNode(node.parentNode.textContent.substring(0, startOffset));
                afterText = document.createTextNode(node.parentNode.textContent.substring(endOffset, node.parentNode.textContent.length));
                highlightNode = returnHighlightedSpan(node.parentNode.textContent.substring(startOffset, endOffset));

                 */

                /** What is at the top of this function:
                 * let highlightNode = returnHighlightedSpan(node.textContent.substring(startOffset, endOffset));
                 * let beforeText = document.createTextNode(node.textContent.substring(0, startOffset));
                   let afterText = document.createTextNode(node.textContent.substring(endOffset, node.textContent.length));
                 */


                nodeParent.insertBefore(beforeText, node);
                nodeParent.insertBefore(highlightNode, node);
                nodeParent.insertBefore(afterText, node);
            }



        } else if (!node.hasChildNodes()){
            ;
        } else {
            $(node).contents().each(function(index, element){
                highlightIndividualNode(startOffset, endOffset, element);
            })
        }
    }

    /** A simple version of the highlight function that doesn't require offset values. Turns out I never use this */
    function highlightIndividualNodeSimple(node){
        highlightIndividualNode(0, node.textContent.length, node);
    }


    /** Feed this function a string or a textNode and it effectively highlights it and returns it to you. Useful because it cuts down the code I have to write since I need to do this a lot */
    function returnHighlightedSpan(textNode){
        let replacementNode = document.createElement("span");

        /** If // Else to allow both TextNode and String input */
        if (typeof textNode === 'string' || textNode instanceof String){



            /** The text node */
            let replacementText = document.createTextNode(textNode);

            /** The parent of the text node which will be highlighted */
            let highlightTextSpan = document.createElement("span");
            highlightTextSpan.className = "AKNOWTATE-TEXT " + uniqueID;
            highlightTextSpan.appendChild(replacementText);
            highlightTextSpan.style.background = color;

            /** The overall "folder" node for grouping */
            replacementNode.appendChild(highlightTextSpan);

            /** Sets the classname for easy selection / removal */
            replacementNode.className = highlightClassName + " " + uniqueID + " " + aknowtateTooltipName;

            return replacementNode;
        }
        else {



            /** The text node */
            let replacementText = document.createTextNode(textNode.textContent);


            /** The parent of the text node which will be highlighted */
            let highlightTextSpan = document.createElement("span");
            highlightTextSpan.className = "AKNOWTATE-TEXT " + uniqueID;
            highlightTextSpan.appendChild(replacementText);
            highlightTextSpan.style.background = color;

            /** The overall "folder" node for grouping */
            replacementNode.appendChild(highlightTextSpan);

            /** Sets the classname for easy selection / removal */
            replacementNode.className = highlightClassName + " " + uniqueID + " " + aknowtateTooltipName;

            return replacementNode;
        }
    }

    /** Clears the user's selection after all the highlighting is done. */
    function clearSelection(){
        if (window.getSelection()){
            window.getSelection().removeAllRanges();
        }
    }

    /** COPIED FROM STACK OVERFLOW:https://stackoverflow.com/questions/34405888/how-can-i-test-which-node-comes-first
     *  Checks which node comes first in the DOM tree of a document. */
    function firstNode(node1, node2) {
        return node1.compareDocumentPosition(node2)
        & Node.DOCUMENT_POSITION_FOLLOWING ? node1 : node2;
    }

    /** Some old shit I never used. Maybe I'll revisit this! */
    function toggleShowForPopup(thisID){
        console.log("Here is the thisID passed to toggleShowForPopup: " + thisID);
        console.log("Here is the className we are finding: " + "popupFromFile " + thisID);
        let toToggle = document.getElementsByClassName("popupFromFile " + thisID)[0];
        toToggle.classList.toggle("show");
    }
}
/** Straight from stackOverflow https://stackoverflow.com/questions/3960843/how-to-find-the-nearest-common-ancestors-of-two-or-more-nodes */
function get_common_ancestor(a, b)
{
    $parentsa = $(a).parents();
    $parentsb = $(b).parents();

    var found = null;

    $parentsa.each(function() {
        var thisa = this;

        $parentsb.each(function() {
            if (thisa == this)
            {
                found = this;
                return false;
            }
        });

        if (found) return false;
    });

    return found;
}




