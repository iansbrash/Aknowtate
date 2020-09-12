/** Used in UI_Test2.html. Copies the selected highlight to clipboard */
function copyText(){
    chrome.storage.sync.get(window.location.href, function (values){
        let highlights = values[window.location.href];

        let ID = getUI_ID();

        /** Instantiated outside the loop since we need to use it later */
        let currentIndex = 0;

        for (; currentIndex < highlights.length; currentIndex++){
            console.log(highlights[currentIndex].uniqueID);
            console.log(highlights[currentIndex].highlightTextContent);

            if (highlights[currentIndex].uniqueID === ID){
                console.log("Found correct highlight at index " + currentIndex);
                break;
            }
        }

        /** Creates a textarea element, selects it, and uses the 'copy' command. Removes the element after */
        let textA = document.createElement("textarea");
        textA.value = highlights[currentIndex].highlightTextContent;
        document.body.appendChild(textA);
        textA.select();
        document.execCommand("copy");
        document.body.removeChild(textA);
        console.log("Successfully copied text");
    })
}

/** Lets user add annotation using contentEditable element */
function addAknowtation() {
    /** We want to close the first popup since we're now opening another popup (the annotation popup) */
    closeAllPopups();
    let popupID = getUI_ID();

    chrome.storage.sync.get(window.location.href, function (highlights) {
        console.log("Annotation icon clicked. Here is the ID we are working with (getUI_ID): " + popupID);

        highlights = highlights[window.location.href];

        let currentIndex = 0;

        console.log("For loop about to start. Here's the popupID we got the the UI_ID function: " + popupID);
        for (; currentIndex < highlights.length; currentIndex++){
            console.log(highlights[currentIndex].uniqueID);
            console.log(highlights[currentIndex].highlightTextContent);

            if (highlights[currentIndex].uniqueID === popupID){
                console.log("Found correct highlight at index " + currentIndex);
                break;
            }
        }

        let aknowtateTextAreaSpan = document.getElementById("aknowtateContainer");
        let aknowtateTextArea = document.getElementById("annotateTextArea")

        aknowtateTextAreaSpan.classList.toggle("show");

        if (highlights[currentIndex].annotation == null){
            aknowtateTextArea.value = null;
        } else {
            aknowtateTextArea.value = highlights[currentIndex].annotation;
        }
        /** Adjusts the popup's size based on how much text is in there */
        autoResize();

        /** Resets size in the case of opening different annotation popups on the same page visit */
        document.getElementById("aknowtateContainer").style.top = "-" + document.getElementById("aknowtateContainer").style.height;
        document.getElementById("aknowtateContainer").style.left = "0";
        let firstSpan = document.getElementsByClassName("popupSpan " + popupID)[0];

        /** Appends the popup so we can see it */
        firstSpan.appendChild(aknowtateTextAreaSpan);
    })
}

function changeTextColor(color){

    console.log("Changing color to: " + color);
    console.log("document.getElementById(\"colorP1\").style.backgroundColor: " + document.getElementById("colorP1").getAttribute("backgroundColor"));

    chrome.storage.sync.get(window.location.href, function (highlights) {
        highlights = highlights[window.location.href];

        let popupID = getUI_ID();
        let idIndex = 0
        let currentID;

        for (; idIndex < highlights.length; idIndex++){
            currentID = highlights[idIndex].uniqueID;
            if (popupID === currentID){
                break;
            }
        }

        highlights[idIndex].color = color;

        let elementsToChangeColor = document.getElementsByClassName("AKNOWTATE-TEXT " + popupID);

        for (let i = 0; i < elementsToChangeColor.length; i++){
            elementsToChangeColor[i].style.background = color; /* highlights[idIndex].color; */
        }

        chrome.storage.sync.set({[window.location.href]: highlights}, function () {
            console.log("done changing color");
        })
    })
}

function deleteHighlight() {
    let ID = getUI_ID();

    chrome.storage.sync.get(window.location.href, function (values) {
        let highlights = values[window.location.href];
        let i = 0
        for (; i < highlights.length; i++){
            let currentID = highlights[i].uniqueID;

            if (currentID === ID){
                console.log("Found the highlight");
                break;
            }
        }

        /** Removes the highlight we want to delete */
        highlights.splice(i, 1);

        if (highlights.length === 0){
            chrome.storage.sync.remove(window.location.href, function () {

            });
        } else {
            chrome.storage.sync.set({[window.location.href]: highlights}, function () {
                /** Now we have to remove the styling */
            })
        }

        let toRemove = document.getElementsByClassName("AKNOWTATE-TEXT " + ID);

        $(toRemove).each(function (index, element) {
            element.style.backgroundColor = "transparent";
            let elClone = element.cloneNode(true);
            elClone.className = "deletedHighlight";
            element.parentNode.replaceChild(elClone, element);
        })
    })
}

function closeAllPopups() {
    document.getElementById("colorPopup").classList.remove("show");
    document.getElementById("AKNOWTATE-POPUP-REFERENCE").classList.remove("show");
    document.getElementById("aknowtateContainer").classList.remove("show");
}

function closeWindow(){
    console.log("Attempting to close the popup_html");
    let popup = document.getElementById("AKNOWTATE-POPUP-REFERENCE");
    popup.classList.remove("show");
}

/** NOTE: Returns a string, not an int */
function getUI_ID() {
    let ID = document.getElementById("AKNOWTATE-POPUP-REFERENCE").classList[1];
    console.log(ID);

    /** Removes any other classes after the ID (which should be 14 characters long... for a very long time. There might be the "show" class after the ID */
    ID = ID.substring(0, 13);
    console.log(ID);
    return parseInt(ID);
}

function autoResize() {
    let textarea = document.getElementById("annotateTextArea");

    console.log("autoResize() called. Here's the ID we're working with: " + textarea.className);
    console.log("Attempting to resize annotation box");

    if (textarea.scrollHeight < 150){
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';

        let xd = document.getElementById("aknowtateContainer");
        xd.style.height = 'auto';
        xd.style.height = (textarea.scrollHeight + 15) +  'px';
    }
}

/** Automatically stores annotations in chrome.storage whenever user inputs text */
function autoSave() {
    let textarea = document.getElementById("annotateTextArea");
    let popupID = getUI_ID();
    let textareaText = textarea.value;

    console.log("autoSave() called. Here's the ID we're working with: " + popupID);

    chrome.storage.sync.get(window.location.href, function (highlights){

        highlights = highlights[window.location.href];

        let currentIndex = 0;

        for (; currentIndex < highlights.length; currentIndex++){
            console.log(highlights[currentIndex].uniqueID);
            console.log(highlights[currentIndex].highlightTextContent);

            if (highlights[currentIndex].uniqueID === popupID){
                console.log("Found correct highlight at index " + currentIndex);
                break;
            }
        }

        highlights[currentIndex].annotation = textareaText;

        chrome.storage.sync.set({[window.location.href]: highlights}, function () {

            chrome.storage.sync.get(window.location.href, function (items){
                console.log("Here's the value we just stored in the textarea: " + highlights[currentIndex].annotation);
                console.log("stored here: " + window.location.href);
                console.log("extra stuff: " + items[window.location.href][currentIndex].annotation);
            })
        })
    })
}

function openUI (thisID) {
    let popup = document.getElementById("AKNOWTATE-POPUP-REFERENCE");
    let uniqueId = thisID

    popup.className = "popupMenuClass " + uniqueId;

    console.log("You clicked on a highlight with ID " + uniqueId);

    let firstSpan = document.getElementsByClassName("popupSpan " + uniqueId)[0];

    firstSpan.appendChild(popup);

    popup.classList.toggle("show");
}

function openColorPopup () {
    closeAllPopups();

    let ID = getUI_ID();
    let firstSpan = document.getElementsByClassName("popupSpan " + ID)[0];
    let colorPopup = document.getElementById("colorPopup");

    firstSpan.appendChild(colorPopup);
    colorPopup.classList.toggle("show");
}


/** Got this from w3schools */
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("annotateHeader")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("annotateHeader").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}