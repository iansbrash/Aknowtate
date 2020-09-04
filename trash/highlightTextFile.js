
var selectionText = window.getSelection().toString();
//alert(selectionText);
console.log("selectionText:");
console.log(selectionText);
var selection = window.getSelection();
var selectionRange = selection.getRangeAt(0);
var container = selectionRange.commonAncestorContainer;
//alert(container.textContent);
console.log("containter.textContent:");
console.log(container.textContent);





replaceNode = document.createElement("p");
replaceText = document.createTextNode(container.textContent);
replaceNode.appendChild(replaceText);
replaceNode.style.background = "yellow";




container.replaceWith(replaceNode);
//alert("done");



console.log ("Focus: " + window.getSelection().focusNode.textContent + ", FocusOffset: " + window.getSelection().focusOffset);
console.log("Anchor: " + window.getSelection().anchorNode.textContent + ", AnchorOffset: " + window.getSelection().anchorOffset);
console.log("done.");













/** a container is a node */
/** the commonAncestorContainer is the deepest node which includes the start and end of the range (selection) */
/** If the selection is only in one <p> node, the commonAncestorContainer will be the <p> node, and you can access the text
 * by doing commonAncestorContainer.innerHTML or cAC.child[0].value (?) */
/** the anchor / focus offset is how far away the selection begins from the nearest ANCHOR node...
 *  here, anchor node might just mean the nearest node. i.e.  a <p> node
 */







/*
alert(selection.anchorNode);
alert(selection.anchorOffset);
alert(selection.focusNode.textContent);
alert(selection.focusOffset);
*/



//var container = selection.getRangeAt(0).commonAncestorContainer;