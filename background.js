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

