/** This file gets executed every time the popup_html.html is opened (can't use inline js in chrome popup_html) */
window.addEventListener("load", function () {
    /** We can use chrome.storage to get the highlights and list them there */
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;

        chrome.storage.sync.get(url, function (highlights) {
            highlights = highlights[url];

            let currentText;
            for (let i = 0; i < highlights.length; i++){

                currentText = highlights[i].highlightTextContent;

                console.log(currentText);

                let spacingDiv = document.createElement("div");
                spacingDiv.className = "spacingDiv";

                let highlightTextDiv = document.createElement("div");
                highlightTextDiv.className = "highlightTextDiv";

                let highlightText = document.createElement("span");
                highlightText.className = "highlightText";

                /** If the text is short enough, just put the entire text in. Otherwise, break it up into "the starting part... and the ending part" fragments */
                if (currentText.length < 40){
                    highlightText.innerHTML = '"' + currentText.substring(0, 32) + "... " + '"';
                } else {
                    highlightText.innerHTML = '"' + currentText.substring(0, 32) + "... " + '"';
                }

                highlightTextDiv.appendChild(highlightText);

                spacingDiv.appendChild(highlightTextDiv);
                document.body.appendChild(spacingDiv);

                /** In order to correctly do this... I think I need to look at message passing. It's definitely way more efficient than whatever I'm doing now... */
            }

            /** Adjusts the header to correctly display the number of highlights */
            let numOfHighlightsHeader = document.getElementById("numOfHighlights");
            if (!highlights){
                ;
            } else {
                numOfHighlightsHeader.innerHTML = "<b>" + highlights.length + " HIGHLIGHTS FOUND." + "</b> <a id=\"imgA\" href=\"repository.html\" target=\"_blank\">\n" +
                    "           <img id=\"homeImg\" src=\"images/popup_html/home.png\" >\n" +
                    "       </a>";
            }
        })
    });
})

/** nOT USED */
function jumpTo(classId){
    window.scrollTo(0, window.document.querySelector(".AKNOWTATE-HIGHLIGHT " + classId).offsetTop);
}