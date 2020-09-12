chrome.storage.sync.get("settings", function (values) {
    let settings = values.settings;
    chrome.storage.sync.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
        console.log("storaged cleared");
        console.log("beginning to cleanse page of highlights...");

        /** TODO: Support cleansing highlights by color */
        let elements = document.getElementsByClassName("AKNOWTATE-TEXT");

        $(elements).each(function(index, element){
            element.className = "";
            element.style.background = "";
        })
    });
})




