contextMenu = {title: "Aknowtate",
                    contexts: ["selection"],
                    onclick: highlightText};

clearStorageMenu = {title: "Clear Storage",
    onclick: clearStorage};

colorContextMenu = {title: "Change Color",
    onclick: changeColor};


/** Store websites with the URL as the key, and an array of the HTML elements that need to be highlighted upon re-visit as the value */
websitesAnnotated = {};

/** Creates context menus for highlighting */
chrome.contextMenus.create(contextMenu);
chrome.contextMenus.create(clearStorageMenu);
chrome.contextMenus.create(colorContextMenu);


 //let extensionID = chrome.runtime.id;


/**
 *  TODO: Allow for annotation (adding text to your highlight)...
 *  TODO: Allow to hover over highlights and delete them, change color, change annotation...
 *      Possible solution: Upon loading, inject a <script> that changes the color of the AKNOWTATE-HIGHLIGHT class when hovered over... and chain it to adjacent highlights... do this by assigning a unique ID to each HL?
 *      During the highlightViaSwim method, I can attach the onmouseover property to the highlighted text... don't know how scalable this is though. Used like onmouseover="function(this)"
 *  TODO: Changing colors, fixing the bug where the first color switch doesn't do anything, giving user a color wheel to pick from and save favorite colors
 *  TODO: Add "dictionary" of all highlights, sorted by both URL and URL Subdomain, and "category"... maybe even search for keywords within annotation or highlight
 *  TODO: Customizable keyboard shortcuts. Also need to make an options page and decide whether I want the popup_html.html or not
 *  TODO: Make an icon for the extension. Maybe a slanted A with a k using the A's right side.
 *  TODO: Make a more effective / rigorous method of storing anchorNode/focusNode/container so it doesn't break when the page's HTML changes
 *  TODO: Implement "autocomplete" for highlight/annotate/URL search using Tries (shows algorithm knowledge)
 *  TODO: Clean up code. This shit is a fucking mess, wow.
 *  TODO: Make use of "global" variables declared within contentScripts (like highlightClassName) for other variables like color
 *  TODO: Add encryption for annotations, as chrome.storage is not encrypted. Could be a premium feature or something.
 *  TODO: Track actions / most frequent uses of the extension / most frequent keyboard shortcuts like the other dude did... just because...
 *  TODO: Along with a better anchor/focus/container storage method, add "advanced option" to use multiple methods to store the nodes so the highlights mess up less often (at the cost of taking up more space on their PC
 *  TODO: Add more documentation so you can take a break from this code and be able to continue working on it in the future
 *  TODO: Things to add to chrome.storage arrays: category, annotation (the user's input)
 *  TODO: Un-highlighting text (toggling the selection's highlight). Make a "smart un-highlight" that recognizes if you're un-highlighted the middle of a chunk of highlight
 *  TODO: I'm done thinking.
 *
 *  TODO：There's a bug when highlighting the "ranking" of a reddit post from the beginning... the anchor/focus becomes... not a node? Not like anyone should be using this on reddit though...
 *  TODO: Remove the aknowtate-highlight tag when cleansing highlights from a page (bc when hovering over it, it still shows
 *  TODO: When searching for a highlight's annotation (using class[1], which is the unique ID), use a self-balancing BST to cut down search times
 */





/** Listens for shortcuts */
chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if (command === "highlightTextCommand"){
        if (window.getSelection()){
            highlightText()
        } else {
            console.log("SHORTCUT ERROR: No text selected.");
        }
    }
    if (command === "changeHighlightColorCommand"){
        changeColor();
    }
    if (command === "clearStorageDeleteHighlights"){
        clearStorage();
    }
});


/** Adds listener to highlight on page load */
chrome.runtime.onInstalled.addListener(function (details){

    if(details.reason == "install"){
        console.log("This is a first install!");

        chrome.storage.sync.get("settings", function (values){
            values = values.settings;

            if (!values){
                console.log("No values were found. oops.");
                /** Sets highlight color to yellow by default, typically on install */
                values = {
                    defaultColor: "yellow",
                    colorP1: "yellow",
                    colorP2: "powderblue",
                    colorP3: "lightpink",
                    colorP4: "white"
                };
            }

            chrome.storage.sync.set({settings: values}, function(){
                console.log("Successfully created the settings object");
                console.log(values);
            })
        })

    }else if(details.reason == "update"){
        let thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");

        chrome.storage.sync.get("settings", function (values){
            values = values.settings;

            if (!values){
                console.log("No values were found. oops.");
                /** Sets highlight color to yellow by default, typically on install */
                values = {
                    defaultColor: "yellow",
                    colorP1: "yellow",
                    colorP2: "powderblue",
                    colorP3: "lightpink",
                    colorP4: "white"
                };
            }

            chrome.storage.sync.set({settings: values}, function(){
                console.log("Successfully created the settings object");
                console.log(values);
            })
        })
    }






    /**
     chrome.runtime.onStartup.addListener(function (details){

     }) */
 })



chrome.tabs.onCreated.addListener(function (tab) {
    window.addEventListener("load", (event) => {
        chrome.tabs.executeScript({file: "/contentScripts/loadHighlights.js"}, () => {
            console.log("Just executed loadHLs.js. This is the callback");
        })
    })
})

function clearStorage(){
    chrome.tabs.executeScript({
        file: "clearStorage.js"
    })
}


function highlightText() {
    console.log("got to highlightTest");
    chrome.tabs.executeScript({ file: "contentScripts/highlightHelper.js"
    })
}

function changeColor(){
    chrome.tabs.executeScript({
        code: "changeColor();"
    })
}

