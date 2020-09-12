/** Adds jQuery 3.5.1 to the page's HTML so I can use jquery in scripts */
/** Help from https://stackoverflow.com/questions/6432984/how-to-add-a-script-element-to-the-dom-and-execute-its-code */
let URL = window.location.href;
let jqS = document.createElement("script");
jqS.type = 'text/javascript';
jqS.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
document.body.appendChild(jqS);

/** Some global variables that we need in other files... should probably store this some other way */
let highlightClassName = "AKNOWTATE-HIGHLIGHT";
let aknowtateTooltipName = "AKNOWTATE-TOOLTIP";
let extensionID = chrome.runtime.id;

console.log("loadHighlightsTest is called ");

window.addEventListener("load", () => {
    /** Attaches the annotation popup_html to the page (hidden) so we can use it when clicking on the annotate button */
    let aknowtatePopupTextarea = document.createElement("div");
    aknowtatePopupTextarea.id = "aknowtateContainer";
    aknowtatePopupTextarea.className = "aknowtateContainer";

    /** TEMP SOLUTION SINCE LOAD() ISN'T WORKING: AKA JUST GIVE IT ALL THE HTML */
    aknowtatePopupTextarea.innerHTML = "<div id=\"annotateHeader\">\n" +
        "\n" +
        "    </div>\n" +
        "    <div id=\"textareaContainer\">\n" +
        "        <textarea id=\"annotateTextArea\" placeholder=\"Enter text here!\">\n" +
        "\n" +
        "        </textarea>\n" +
        "    </div>";

    document.body.appendChild(aknowtatePopupTextarea);
}); // nice





/** Attatches the popup_html to the page (hidden) so we can use it when clicking on highlights */
let aknowtatePopupReference = document.createElement("div");
aknowtatePopupReference.className = "popupMenuClass"
aknowtatePopupReference.id = "AKNOWTATE-POPUP-REFERENCE";
aknowtatePopupReference.innerHTML = "<img id=\"ak1\"  class=\"popupMenuClassItem\">\n" +
    "    <img id=\"ak2\"  class=\"popupMenuClassItem\">\n" +
    "    <img id=\"ak3\"  class=\"popupMenuClassItem\">\n" +
    "    <img id=\"ak4\"  class=\"popupMenuClassItem\">";
document.body.appendChild(aknowtatePopupReference);
/** ----- */

/** Creates the popup for when we click on highlights */
window.addEventListener("load", (ev) => {

    let pathCopy = "chrome-extension://" + extensionID + "/images/popup_images/copy_text.png"
    let pathAknowtate = "chrome-extension://" + extensionID + "/images/popup_images/aknowtate_medium.png"
    let pathColor = "chrome-extension://" + extensionID + "/images/popup_images/highlight_img.png"
    let pathClose = "chrome-extension://" + extensionID + "/images/repo_images/trash.png"

    document.getElementById("ak1").src = pathCopy;
    document.getElementById("ak2").src = pathAknowtate;
    document.getElementById("ak3").src = pathColor;
    document.getElementById("ak4").src = pathClose;
});
/** ----- */

/** Appends the color picker UI to the document. Revealed when clicking on the "change color" UI button. */
let colorUI = document.createElement("div");
colorUI.className = "popupMenuClass";
colorUI.id = "colorPopup";

let colorUIsrc = "chrome-extension://" + extensionID + "/images/popup_images/custom_color.png"

colorUI.innerHTML = "<div class=\"colorSelection\" id=\"colorP1\"></div>\n" +
    "    <div class=\"colorSelection\" id=\"colorP2\"></div>\n" +
    "    <div class=\"colorSelection\" id=\"colorP3\"></div>\n" +
    "    <div class=\"colorSelection\" id=\"colorP4\">\n" +
            "<label id='inputLabel'>" +
                "<input id='colorInput' type=\"color\">" +
        "        <img id=\"customColorImg\" src=" + colorUIsrc + ">\n" +
            "</label>" +
    "    </div>"

document.body.appendChild(colorUI);
/** ----------------- */

chrome.storage.sync.get(URL, function(result) {
    console.log("Just did chrome.storage.sync.get(URL, function callback");

    result = result[URL];
    console.log("just did result = result[URL]");

    if (!result){
        console.log("no highlights found for this URL.");
    } else if (result.length === 0){
        chrome.storage.sync.remove(URL);
    } else {
        console.log(result.length + " highlights found for this URL.");

        let documentHTML = document.documentElement;

        for (let i = 0; i < result.length; i++){

            console.log(result[i].highlightTextContent);

            let selection = result[i].selection;
            let container = result[i].container;
            let anchorNode = result[i].anchorNode;
            let focusNode = result[i].focusNode;
            let anchorOffset = result[i].anchorOffset;
            let focusOffset = result[i].focusOffset;
            let containerIndexArray = result[i].containerIndexArray;
            let anchorNodeIndexArray = result[i].anchorNodeIndexArray;
            let focusNodeIndexArray = result[i].focusNodeIndexArray;
            let color = result[i].color;
            let uniqueID = result[i].uniqueID;
            //let highlightText = result[i].highlightTextContent;
            let anchorNodeTextContent = result[i].anchorNodeTextContent;
            let focusNodeTextContent = result[i].focusNodeTextContent;
            let hasCorrectedOffsets = result[i].hasCorrectedOffsets;

            /** Other ideas to store highlights:
             * Get the node. Search the document to see if it is a unique node.
             *      If so, store it
             * If not, get its parent. Repeat with the parent. (is the parent a unique node)?
             * Do this until you get a unique node.
             */

            console.log("Calling fNFAAD of anchorNode");
            anchorNode = findNodeFromArrayAndDocument(anchorNodeIndexArray, documentHTML, anchorNodeTextContent, anchorOffset);

            console.log("Calling fNFAAD of focusNode");
            focusNode = findNodeFromArrayAndDocument(focusNodeIndexArray, documentHTML, focusNodeTextContent, focusOffset);

            console.log("Calling fNFAAD of container");

            /** Fallback if deletion happened / highlightWrapper collision */
            if (!anchorNode){
                console.log("fNFAAD didn't work for anchorNode. Calling fallback function");
            }
            if (!focusNode){
                console.log("fNFAAD didn't work for focusNode. Calling fallback function");
            }

            console.log("Done establishing variables for iteration #" + i + ". Here are some variables:");
            console.log("anchorOffset: " + anchorOffset + ", focusOffset: " + focusOffset + ", container.textContent: " + container.textContent);
            console.log("anchorNode.textContent: " + anchorNode.textContent)

            highlightViaSwim(selection, container, anchorNode, focusNode, anchorOffset, focusOffset, color, uniqueID, hasCorrectedOffsets);
        }

        /** Initializes the highlights */
        initialize();

        initializeUIFunctions();

        console.log("Done loading and initializing");
    }
});

/** Add the text as a parameter as a fallback... */
/** Check if the className is aknowtateDOMSaver */
function findNodeFromArrayAndDocument(nodeIndexArray, htmlElement, nodeTextContent, nodeOffset) {
    let currentIndex;
    let currentChild = htmlElement;

    //let nodeIndexArrayCopy = nodeIndexArray.clone();
    let nodeIndexArrayCopy = nodeIndexArray.map((x) => x);

    let specialCaseDone = false;
    let specialCaseNode;

    while (!(nodeIndexArray.length === 0)) {

        if (!currentChild){
            break;
        }

        /** Here, we will use the absolute anchor/focusOffset... I think? */
        if (currentChild.className === "aknowtateDOMSaver"){
            let childList = currentChild.childNodes;
            let currentOffset = 0;

            $(childList).each((index, element) => {
                if (currentOffset + element.textContent.length > nodeOffset) {
                    currentChild = element;
                    console.log("About to break from loop. 'LOOP BROKEN' should be next log.");
                    return false;
                } else {
                    currentOffset += element.textContent.length;
                }
            });
            break;
        }
        currentIndex = nodeIndexArray.shift();
        currentChild = $(currentChild.childNodes).get(currentIndex);
    }

    console.log("LOOP BROKEN");

    if (!currentChild){
        console.log("!currentChild is true.. need to use backup method");
        currentChild = htmlElement;
        while (!(nodeIndexArrayCopy.length === 0)) {
            console.log(nodeIndexArrayCopy.length + " is nodeindexarraycopylength");
            console.log("getting the " + nodeIndexArrayCopy[0] + "th child element");
            console.log("currentChild.textContent: " + currentChild.textContent);

            if (nodeIndexArrayCopy.length === 1  && !currentChild.hasChildNodes()){
                break;
            }

            currentIndex = nodeIndexArrayCopy.shift();
            currentChild = $(currentChild.childNodes).get(currentIndex);
        }
    }
    console.log("currentChild.textContent: " + currentChild.textContent);

    return currentChild;

    /** Unused, apparently */
    function specialCaseRecursiveHelper (node) {
        if (!specialCaseDone){

            $(node.childNodes).each(function (index, element) {
                console.log("element.textContent: " + element.textContent + " at index: " + index);
                if (element.textContent === nodeTextContent){
                    specialCaseNode = element;
                    specialCaseDone = true;
                } else {
                    specialCaseRecursiveHelper(element);
                }
            })
        }
    }
}