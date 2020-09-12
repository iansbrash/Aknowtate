/** Code under here is to initialize the different buttons in the UI to execute scripts */
function initializeUIFunctions() {
    window.addEventListener("load", () => {
        document.getElementById("ak1").addEventListener("click", function () {
            copyText();
        })
        document.getElementById("ak2").addEventListener("click", function () {
            addAknowtation();
        })
        document.getElementById("ak3").addEventListener("click", function () {
            openColorPopup();
        })
        document.getElementById("ak4").addEventListener("click", function (thisEvent) {
            deleteHighlight();
        })

        document.getElementById("annotateTextArea").addEventListener("input", function () {
            autoResize();
            autoSave();
        })

        /** Closes window when clicking outside of button... should repurpose X button to delete highlight */
        window.onclick = function(event) {
            event.stopPropagation();
            if (!event.target.matches(".AKNOWTATE-TEXT")) {
                closeWindow();
            }
        }

        window.addEventListener("keydown", function(event) {
            if (event.key === "Escape"){
                closeAllPopups();
            }
        })

        /** Lets the annotation box be draggable */
        dragElement(document.getElementById("aknowtateContainer"));

        /** Sets the colors for the colorUI */
        document.getElementById("colorP1").addEventListener("click", function () {
            chrome.storage.sync.get("settings", function (values) {

                console.log("Values before getting into settings: " + values);
                console.log("values.colorP1: " + values.colorP1);
                console.log("values.defaultColor: " + values.defaultColor);

                values = values.settings;
                console.log("Values after getting into settings: " + values);
                let color = values.colorP1;
                changeTextColor(color);
            })
        })

        document.getElementById("colorP2").addEventListener("click", function () {
            chrome.storage.sync.get("settings", function (values) {
            values = values.settings;
            let color = values.colorP2;
            changeTextColor(color);
            })
        })
        document.getElementById("colorP3").addEventListener("click", function () {
            chrome.storage.sync.get("settings", function (values) {
                values = values.settings;
                let color = values.colorP3;
                changeTextColor(color);
            })
        })
        /** ------------ */

        /** Allows for cute styling of the html5 color input in the colorPopup */
        $(document).on('change', 'input[type=color]', function() {
            this.parentNode.style.backgroundColor = this.value;

            let toChange = this.value;
            console.log("toChange: " + toChange);

            chrome.storage.sync.get("settings", (values) => {

                values = values.settings;

                values.colorP4 = toChange;

                changeTextColor(toChange);

                chrome.storage.sync.set({settings: values}, function () {
                    console.log("Successfully changed custom color to " + values.colorP4);

                })
            })
        });

        /** Gets the custom color and changes the label's background color to it */
        chrome.storage.sync.get("settings", (values) => {

            values = values.settings;

            let colorP4 = values.colorP4;

            if (!colorP4) {
                colorP4 = "white";
            }

            console.log("ColorP4: " + colorP4);

            document.getElementById("inputLabel").style.backgroundColor = colorP4;
            document.getElementById("colorInput").value = colorP4;
        })

    })
}
/** End code to initialize UI functions */