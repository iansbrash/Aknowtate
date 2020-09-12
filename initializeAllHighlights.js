/** This file is for adding event listeners to add highlights on a page. Supposed to be called when the page is loaded (so in storeHighlights.js) */

/** Here's the plan:
 *  use chrome.storage.sync.get to get all the highlights for the page
 *  for each uniqueID, add an event listener that waits for a mouse click
 *  for each uniqueID's contentEditable span, add an event listener that waits for "input",
 *      which then activates the callback function() {
 *          use chrome.storage.sync.get, find the object that corresponds to the highlight
 *          update the object's aknowtation object (the text) and chrome.storage.sync.set the new innerHTML
 *      }
 *  This should all be in a <script> element in the page which is injected by loadAllHighlights
 */

/** Some more logistics:
 *  The method in this file should take in an individual highlight object, and can be called in the loadAllHighlights process so we don't make calls to chrome.storage twice
 *
 * popupSpan is the className for the span inside
 * */

/** This function should be called after all highlights are actually loaded onto the page (and assigned uniqueIDs) */

function initialize() {

    let thisId, thisColor;

    chrome.storage.sync.get(window.location.href, function(highlightList) {

        highlightList = highlightList[window.location.href];

        for (let i = 0; i < highlightList.length; i++) {

            let currentID = highlightList[i].uniqueID;

            console.log("Currently initializing highlight with ID: " + currentID);

            let elementsToInitialize = document.getElementsByClassName("AKNOWTATE-TEXT " + currentID);

            console.log("elementsToInitialize.length: " + elementsToInitialize.length);

            for (let i = 0; i < elementsToInitialize.length; i++) {
                console.log("Iterating through element #" + i);
                    elementsToInitialize[i].addEventListener("click", function () {openUI(currentID)});
            }
        }
    })
}

