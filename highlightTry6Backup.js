function dontusethislmao () {
    function highlightViaSwimBackup(selection, container, anchorNode, focusNode, anchorOffset, focusOffset, color, uniqueId){

        let uniqueID;
        if (uniqueId){
            uniqueID = uniqueId
        } else {
            uniqueID = Date.now();
        }


        console.log("highlightViaSwim called");
        console.log("anchorNode.parentNode.hasChildNodes(): " + anchorNode.parentNode.hasChildNodes());

        let aOff, fOff, aNode, fNode, commonAncestorContainer;

        if (container && anchorNode && focusNode && anchorOffset && focusOffset){
            aOff = anchorOffset;
            fOff = focusOffset;

            aNode = anchorNode;
            fNode = focusNode;

            commonAncestorContainer = container;
        }
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
        }
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

        console.log("aNode.textContent: " + aNode.textContent);
        console.log("aNode.parentNode.hasChildNodes(): " + aNode.parentNode.hasChildNodes());



        console.log("aNode.compareDocumentPosition(commonAncestorContainer): " + (aNode.compareDocumentPosition(commonAncestorContainer)));
        console.log("aNode.compareDocumentPosition(aNode.parentNode): " + (aNode.compareDocumentPosition(aNode.parentNode)));
        console.log("aNode.compareDocumentPosition(fNode): " + (aNode.compareDocumentPosition(fNode)));

        if (aNode.isSameNode(fNode)) {

            /** Swaps anchorOffset and focusOffset if user highlights from right to left (instead of rtl) */
            if (aOff > fOff) {
                let temp = aOff;
                aOff = fOff;
                fOff = temp;
            }
            highlightIndividualNode(aOff, fOff, aNode, color, uniqueID);

            //deleteNodes();
            /** tentative */
            aNode.parentNode.removeChild(aNode);

            //storeHighlights(selection, websiteToStore);
            //storeHighlightsHelper();
            clearSelection();
        }




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

            let aNodeCopy = aNode;
            let fNodeCopy = fNode;
            let aOffCopy = aOff;
            let fOffCopy = fOff;

            swimUpFromNode(selection, aNode, fNode, aNode, commonAncestorContainer, color, uniqueID);

            /** Highlights the anchorNode */
            highlightIndividualNode(aOffCopy, aNodeCopy.textContent.length, aNodeCopy, color, uniqueID);

            /** Highlights the focusNode */
            highlightIndividualNode(0, fOffCopy, fNodeCopy, color, uniqueID);

            /** We do not remove these nodes until the very end, and instead of using aNode and fNode, we use selection.anchorNode
             *  and selection.focusNode as we have since modified the aNode and fNodes */
            aNodeCopy.parentNode.removeChild(aNodeCopy);
            fNodeCopy.parentNode.removeChild(fNodeCopy);


            clearSelection();
            //storeHighlights(selection, websiteToStore);
        }
    }

    /** Could be used to replace... fucking... everything? idk */
    /** TENTATIVE: Just added the commonAncestorContainer argument to the function's parameters */
    function swimUpFromNode(selection, aNode, fNode, swimNode, commonAncestorContainer, color, uniqueID){

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
                    swimDownFromNode(aNode, fNode, element, color, uniqueID);
                }
            })
            swimUpFromNode(selection, aNode, fNode, swimNode.parentNode, commonAncestorContainer, color, uniqueID);
        }
    }

    function swimDownFromNode(aNode, fNode, sinkNode, color, uniqueID){
        if (sinkNode.nodeType === Node.TEXT_NODE &&
            (aNode.compareDocumentPosition(sinkNode) === 4 &&
                (fNode.compareDocumentPosition(sinkNode) === 2 || fNode.compareDocumentPosition(sinkNode) === 10))){

            /** Got whitespace checking from:
             * https://stackoverflow.com/questions/1172206/how-to-check-if-a-text-is-all-white-space-characters-in-client-side */
            if (sinkNode.textContent.trim().length == 0){
                ;
            }
            else {
                let repNode = returnHighlightedSpan(sinkNode, color, uniqueID);
                sinkNode.replaceWith(repNode);
            }
        }
        else if (!sinkNode.hasChildNodes()){
            ;
        } else {
            $(sinkNode.childNodes).each(function(index, element){
                swimDownFromNode(aNode, fNode, element, color, uniqueID);
            })
        }
    }


    function highlightIndividualNode(startOffset, endOffset, node, color, uniqueID){
        if (node.nodeType === Node.TEXT_NODE){
            /** Tentative */
                //nodesToDelete.push(node);

            let highlightNode = returnHighlightedSpan(node.textContent.substring(startOffset, endOffset), color, uniqueID);
            highlightNode.style.background = color;

            /** TODO: THE PROBLEM: */
            /** TODO: Opening a tooltip that is stored somewhere (and not hard-coding it into every highlight)
             *  TODO: Possible solution: Each highlight has a span called like className = "AKNOWTATE-TOOLTIP uniqueID"
             *      Add a listener to each highlight that is like "on click, append this HTML to the inner span AKNOWTATE-TOOLTIP
             *          Can be done with jQuery as well? Like... $(.AKNOWTATE-HIGHLIGHT).on("click", function () {
             *              this.firstChild.innerHTML = $(document.getElementById("baseToolTip"));
             *          }
             */

            let popupSpan = document.createElement("span");
            popupSpan.className = "popupSpan " + uniqueID;
            popupSpan.contentEditable = "true";

            let editableText = document.createTextNode("Edit this text!");


            popupSpan.appendChild(editableText);
            highlightNode.appendChild(popupSpan);



            /** To make popup_html: Append a editablecontent node to the highlightNode... go somewhere from there... */
            //let popup_html = document.createElement("span");
            //popup_html.contentEditable = "true";
            /** Opposite of hidden is "visible" */
            //popup_html.style.visibility = "hidden";
            /**
             popup_html.appendChild(document.createTextNode("Edit this content!"));
             popup_html.className = "AK";
             highlightNode.appendChild(popup_html); */
            /**
             let popupFromFile = document.createElement("span");
             let path = "chrome-extension://" + extensionID + "/UI_Test.html"
             $(popupFromFile).load(path);
             popupFromFile.className = "popupFromFile " + uniqueID;
             console.log("popupFromFile's className: " + popupFromFile.className);
             popupFromFile.style.visibility = "hidden"; */
            //highlightNode.appendChild(popupFromFile);



            /**Tentative stuff that tries to import "UI_Test.html" and use it as the popup_html */




            /** Sets the classname for easy selection / removal */
            highlightNode.className = highlightClassName + " " + uniqueID + " " + aknowtateTooltipName;
            //highlightNode.id = uniqueID;

            /**
             highlightNode.onclick = function(){
            let classNameToAppend = "popupSpan " + this.classList[1];
            let firstSpan = document.getElementsByClassName(classNameToAppend)[0];
            let popupToClone = document.getElementById("AKNOWTATE-POPUP-REFERENCE");
            let clone = $(popupToClone).clone();
            clone.id = "";
            clone.style.visibility = "visible";
            firstSpan.appendChild(clone);



        } */


                //highlightNode.onclick = function(){console.log("toggled"); toggleShowForPopup(this.classList[1])};


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
                highlightIndividualNode(startOffset, endOffset, element, color, uniqueID);
            })
        }
    }

    function highlightIndividualNodeSimple(node, color, uniqueID){

        highlightIndividualNode(0, node.textContent.length, color, uniqueID);
        /**
         if (node.nodeType === Node.TEXT_NODE) {


        let highlightNode = returnHighlightedSpan(node, color, uniqueID);
        highlightNode.style.background = color;
        //Sets the classname for easy selection / removal
        highlightNode.className = highlightClassName + " " + uniqueID + " " + aknowtateTooltipName;
        //highlightNode.id = uniqueID;

        node.replaceWith(highlightNode);
    }
         else {
        //nodesToDelete.push(node);
        node.style.background = color;
    } */
    }




    function returnHighlightedSpan(textNode, color, uniqueID){
        let replacementNode = document.createElement("span");

        /** If // Else to allow both TextNode and String input */
        if (typeof textNode === 'string' || textNode instanceof String){
            let replacementText = document.createTextNode(textNode);
            replacementNode.appendChild(replacementText);
            replacementNode.style.background = color;


            /** Sets the classname for easy selection / removal */
            replacementNode.className = highlightClassName + " " + uniqueID + " " + aknowtateTooltipName;
            //replacementNode.id = uniqueID;

            return replacementNode;
        }
        else {
            let replacementText = document.createTextNode(textNode.textContent);
            replacementNode.appendChild(replacementText);
            replacementNode.style.background = color;

            /** Sets the classname for easy selection / removal */
            replacementNode.className = highlightClassName + " " + uniqueID + " " + aknowtateTooltipName;
            //replacementNode.id = uniqueID;

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
        //console.log("nodesToDelete.length: " + nodesToDelete.length);
        //nodesToDelete.forEach(element => element.parentNode.removeChild(element))
    }
    /**
     function storeHighlightsHelper(){
    console.log("Got to storeHighlightsHelper");
    $.getScript( "storeHighlights.js", function( data, textStatus, jqxhr ) {
        console.log( data ); // Data returned
        console.log( textStatus ); // Success
        console.log( jqxhr.status ); // 200
        console.log( "Load was performed." );
    });
} */

    function toggleShowForPopup(thisID){
        console.log("Here is the thisID passed to toggleShowForPopup: " + thisID);
        console.log("Here is the className we are finding: " + "popupFromFile " + thisID);
        let toToggle = document.getElementsByClassName("popupFromFile " + thisID)[0];
        toToggle.classList.toggle("show");
    }
}




