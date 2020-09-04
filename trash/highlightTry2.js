selection = window.getSelection();

selectionText = selection.toString();

selectionContainer = selection.getRangeAt(0).commonAncestorContainer;

containerTextContent = selectionContainer.textContent;

//alert("file has loaded");

console.log("container innerHTML: ")
console.log(selectionContainer.hasChildNodes());




scanContainerHelper(selectionContainer, selection, selectionContainer.parentNode);




selectionContainer.parent.style.background = "yellow";


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

    /** DIFFERENT VARIABLES
     * replaceDiv: the element we are replacing the selection's element with
     * replaceNodeHighlight: the highlighted text
     * replaceNodeBefore: the text before the highlighted text
     * replaceNodeAfter: the text after the highlighted text
     */


    if (element === selection.anchorNode && element === selection.focusNode){
        //alert("found both anchorNode and focusNode")
        alert(element.tagName);
        alert(element.nodeValue);

        //let parent = element.parent;
        let parentReplacement = document.createElement(parentNode.tagName.toLowerCase());
        alert(parentNode.tagName);


        for (let i = 0; i < parentNode.childElementCount; i++){
            if (parentNode.childNodes[i].is(element)){
                let replaceDiv = document.createElement("a");

                //let selectionElement = element.get(0).tagName.toLowerCase();
                //alert(selectionElement);
                //alert(element.tagName);


                let replaceNodeHighlight = document.createElement("a");
                let replaceTextHighlight = document.createTextNode(element.nodeValue.substring(selection.anchorOffset, selection.focusOffset));
                //replaceNodeHighlight.appendChild(replaceTextHighlight);
                replaceNodeHighlight.style.background = "yellow";

                //let replaceNodeBefore = document.createElement("nobr");
                let replaceTextBefore = document.createTextNode(element.nodeValue.substring(0, selection.anchorOffset))
                //replaceNodeBefore.appendChild(replaceTextBefore);

                //let replaceNodeAfter = document.createElement("nobr");
                let replaceTextAfter = document.createTextNode(element.nodeValue.substring(selection.focusOffset))
                //replaceNodeAfter.appendChild(replaceTextAfter);


                parentReplacement.appendChild(replaceTextBefore);
                parentReplacement.appendChild(replaceNodeHighlight);
                parentReplacement.appendChild(replaceTextAfter);

                //element.replaceWith(replaceDiv);
            }
            else {
                parentReplacement.appendChild(parentNode.childNodes[i]);
            }
        }
        parentNode.replaceWith(parentReplacement);



    }
    else if (element === selection.anchorNode) {
        alert("found anchorNode");
        // element.nodeType
        console.log(selection.anchorOffset);
    }
    else if (element === selection.focusNode){
        alert("found focusNode");
        console.log(selection.focusOffset);
    }
    else if (element.hasChildNodes()) {
        while (element.hasChildNodes()) {
            let cNode = element.removeChild(element.childNodes[0]);
            scanContainerHelper(cNode);
        }
    }
    else {
        ;
    }
}

/*
function scanContainer(container) {
    while (container.hasChildNodes()){
        let cNode = container.removeChild(container.childNodes[0]);
        scanContainerHelper(cNode);
    }
}
*/
