window.addEventListener("load", function () {

    let highlightsForSearch = new Array();

    /** Creates event listener for search bar */
    document.getElementById("searchInput").addEventListener("input", function (event) {
        console.log(event.target.value);

        let searchArray = [];

        if (event.target.value){
            searchArray = highlightsForSearch.filter(HL => HL.toLowerCase().includes(event.target.value));
        }

        let toDel = document.getElementsByClassName("searchResult");
        $(toDel).each(function (index, element) {
            element.parentElement.removeChild(element);
        })

        if (searchArray.length != 0){

            document.getElementById("search").style.borderBottomLeftRadius = "0px";
            document.getElementById("search").style.borderBottomRightRadius = "0px";
            console.log(searchArray);

            for (let i = 0; i < searchArray.length; i++){
                let searchAppend = document.createElement("div");
                searchAppend.className = "searchResult";
                searchAppend.innerHTML = searchArray[i];
                document.getElementsByClassName("searchResultContainer")[0].appendChild(searchAppend);
            }
        } else {
            document.getElementById("search").style.borderBottomLeftRadius = "8px";
            document.getElementById("search").style.borderBottomRightRadius = "8px";
        }
    })

    /** Creates the modal */
    let modalPopup = document.createElement("div");
    modalPopup.id = "modalPopup";
    modalPopup.className = "modal";

    let modalPopupContent = document.createElement("div");
    modalPopupContent.id = "modalPopupContent";
    modalPopupContent.className = "modalContent";

    modalPopupContent.innerHTML = "<div class=\"modalHeader\">\n" +
        "      <span class=\"modalClose\">&times;</span>\n" +
        "      <h2 id='aFor'>Modal Header</h2>\n" +
        "    </div>\n" +
        "    <div class=\"modalBody\">\n" +
        "      <p>Some text in the Modal Body</p>\n" +
        "      <p>Some other text...</p>\n" +
        "    </div>\n" +
        "    <div class=\"modalFooter\">\n" +
        "      <h3>Modal Footer</h3>\n" +
        "    </div>";

    modalPopup.appendChild(modalPopupContent);

    document.body.appendChild(modalPopup);
    /** ------ */

    /** Creates the edit/delete icons when hovering in the modal */
    let deleteIcon = document.createElement("div");
    deleteIcon.className = "modalIcon";

    let deleteIconImg = document.createElement("img");
    deleteIconImg.src = "images/repo_images/trash.png";
    deleteIconImg.id = "deleteIconImg";
    deleteIcon.appendChild(deleteIconImg);

    let editIcon = document.createElement("div");
    editIcon.className = "modalIcon";

    let editIconImg = document.createElement("img");
    editIconImg.src = "images/popup_images/aknowtate_big.png";
    editIconImg.id = "editIconImg";
    editIcon.appendChild(editIconImg);

    let iconHolder = document.createElement("div");
    iconHolder.className = "modalIconHolder";

    iconHolder.appendChild(editIcon);
    iconHolder.appendChild(deleteIcon);

    document.body.appendChild(iconHolder);

    document.getElementsByClassName("closebtn")[0].addEventListener("click", function () {
        toggleNav();
    })
    /** ------ */

    /** Creates the event listeners for the above delete/edit buttons */
    $(deleteIcon).on("click", function () {

        /** we need to use uniqueID instead and iterate through elements to find the right one ot remove */
        let toDel = deleteIcon.parentNode.parentNode.parentNode;
        let uniqueID = toDel.getAttribute("uniqueid");
        console.log("Removing this uniqueID: " + uniqueID);

        let url = document.getElementById("aFor").firstElementChild.textContent;
        chrome.storage.sync.get(url, function (values) {
            let highlights = values[document.getElementById("aFor").firstElementChild.textContent];

            console.log("Highlights: " + highlights);

            /** Takes out the icons so they don't get deleted with the highlight */
            document.body.appendChild(document.getElementsByClassName("modalIconHolder")[0]);

            toDel.parentNode.removeChild(toDel);

            if (highlights.length === 1){
                chrome.storage.sync.remove(url);
            } else {
                $(highlights).each(function (index, element) {
                    if (element.uniqueID.toString() === uniqueID.toString()){
                        highlights.splice(index, 1);
                        console.log("found correct uniqueID in remove function");
                        return false;
                    }
                })

                console.log("Highlights: " + highlights);

                chrome.storage.sync.set({[url]: highlights}, function () {
                    /** Testing purposes only from here on */
                    chrome.storage.sync.get(url, function (values) {
                        values = values[url];
                        $(values).each(function (index, element) {
                            console.log(element.highlightTextContent);
                        })
                    })
                })
            }
        })
    })
    /** ------ */


    /** Passing in null gives us all the values */
    chrome.storage.sync.get(null, function (items) {
        console.log("Got inside storage sync");
        console.log(items + " is items.length");

        /** Array we will use to check if we have added a hostname to the repository list already */
        let allKeys = Object.keys(items);
        console.log(allKeys[0]);

        console.log("allKeys length: " + allKeys.length);
        console.log("allKeys: " + allKeys);
        console.log("document.getElementById(\"appendSitesUnder\"); " + document.getElementById("appendSitesUnder"))

        let hostnameArray = new Array();
        let columnIndex = 0;
        let settingsFound = false;

        for (let i = 0; i < allKeys.length; i++){
            if (!settingsFound && allKeys[i] === "settings"){
                console.log("Found settings. Attempting to delete settings from allKeys");
                allKeys.splice(i, 1);
                settingsFound = true;
                i--;
                continue;
            }

            let appendSitesUnder;
            if (columnIndex % 2 === 0){
                appendSitesUnder = document.getElementById("col1");
            } else {
                appendSitesUnder = document.getElementById("col2");
            }

            console.log(i);
            console.log(allKeys[i]);

            let urlObject = new URL(allKeys[i]);
            let siteToAppend;
            let siteColumn;
            let dropdownSites;

            /** Adds all highlights and annotations to the array we created at the very top of this file (used for searching) */
            chrome.storage.sync.get(urlObject.href, function (values) {
                let highlights = values[urlObject.href];
                for (let i = 0; i < highlights.length; i++){

                    /** Adds the highlights to the array */
                    highlightsForSearch.push(highlights[i].highlightTextContent);

                    /** Adds annotations */
                    if (highlights[i].annotation){
                        highlightsForSearch.push(highlights[i].annotation);
                    }

                }
            })

            /** Don't have to create the entire siteColumnContainer element and its children if it already exists (hostname is there) */
            if (hostnameArray.includes(urlObject.hostname)){
                let dropdownSitesUrl = document.createElement("div");
                dropdownSitesUrl.className = "dropdownSitesUrl";
                dropdownSitesUrl.innerHTML = urlObject.pathname;
                dropdownSitesUrl.id = allKeys[i];

                /** Must parse int and then turn to int upon call */
                dropdownSitesUrl.setAttribute("highlightIndex", i + "");
                dropdownSites = document.getElementById(urlObject.hostname).querySelectorAll(".dropdownSites")[0];
                dropdownSites.appendChild(dropdownSitesUrl);

                let toAppendUnder = document.getElementById(urlObject.hostname);
                let editing = toAppendUnder.firstElementChild.lastElementChild.firstElementChild;
                console.log("editingInnerHTMT: " +  editing.innerHTML);

                let num = parseInt(editing.textContent);
                num++;

                editing.innerHTML = num + "";
            } else {
                columnIndex++;

                siteToAppend = document.createElement("div");
                siteToAppend.className = "siteColumnContainer";

                /** lets us check if we have created a block for a hostname yet */
                siteToAppend.id = urlObject.hostname;

                siteColumn = document.createElement("div");
                siteColumn.className = "siteColumn";

                hostnameArray.push(urlObject.hostname);
                let siteColumnUrl = document.createElement("div");
                siteColumnUrl.className = "siteColumnUrl";

                let siteColumnUrlText = document.createElement("span");
                siteColumnUrlText.className = "siteColumnUrlText";

                siteColumnUrlText.innerHTML = urlObject.hostname;

                siteColumn.innerHTML = "<div class=\"siteColumnThumbContainer\">\n" +
                    "                        <div class=\"siteColumnThumb\">\n" +
                    "                            <img class='columnThumbImg' src='" + "https://" + urlObject.hostname + '/favicon.ico' + "'>\n" +
                    "                        </div>\n" +
                    "                    </div>"

                siteToAppend.appendChild(siteColumn);

                siteColumnUrl.appendChild(siteColumnUrlText);

                siteColumn.appendChild(siteColumnUrl);

                dropdownSites = document.createElement("div");
                dropdownSites.className = "dropdownSites";

                /** Fixes dropdown needing 2 clicks at first to open */
                dropdownSites.style.height = "0px";

                let dropdownSitesUrl = document.createElement("div");
                dropdownSitesUrl.className = "dropdownSitesUrl";
                dropdownSitesUrl.id = allKeys[i];
                dropdownSitesUrl.innerHTML = urlObject.pathname;

                /** Must parse int and then turn to int upon call */
                dropdownSitesUrl.setAttribute("highlightIndex", i + "");

                dropdownSites.appendChild(dropdownSitesUrl);
                siteColumn.addEventListener("click", function () {
                    toggleDropdown(dropdownSites);
                })
                siteToAppend.appendChild(dropdownSites);
                appendSitesUnder.appendChild(siteToAppend);

                let numOfSites = document.createElement("div");
                numOfSites.className = "numOfSites";
                numOfSites.innerHTML = "<span class='numOfSitesText'>\n" +
                    "                                1\n" +
                    "                            </span>"
                siteColumn.appendChild(numOfSites)
            }
        }

        /** Opens modal */
        $(".dropdownSitesUrl").on("click", function () {

            let key = this.id;

            console.log("clicked");

            document.getElementsByClassName("modalBody")[0].innerHTML = "";
            document.getElementsByClassName("modalHeader")[0].firstElementChild.nextElementSibling.innerHTML = "Annotations for " + '<a href="' + key + '">' + key + "<a/>";
            document.getElementsByClassName("modalFooter")[0].firstElementChild.innerHTML = "xd";

            document.getElementById("modalPopup").style.display = "block";

            console.log("Using this key: " + key);

            chrome.storage.sync.get(key, function (values) {
                let highlights = values[key];
                for (let i = 0; i < highlights.length; i++){

                    let insertDiv = document.createElement("div");
                    insertDiv.className = "modalAnnotationContainer";
                    insertDiv.setAttribute("uniqueID", highlights[i].uniqueID);

                    let highlightText = document.createElement("div");
                    highlightText.className = "modalHighlight";

                    let hlText = highlights[i].highlightTextContent;

                    let actualHighlightText = document.createElement("div");
                    actualHighlightText.className = "modalHighlightText";

                    let annotation = document.createElement("div");

                    if (hlText.length < 35){
                        actualHighlightText.innerHTML = "<b>" +  '"' + highlights[i].highlightTextContent + '"' + "</b>";
                        highlightText.style.height = "25%";
                        annotation.style.height = "75%";
                    }
                    else if (hlText.length < 60){
                        actualHighlightText.innerHTML = "<b>" +  '"' + highlights[i].highlightTextContent + '"' + "</b>";
                        highlightText.style.height = "50%";
                        annotation.style.height = "50%";
                    } else {
                        actualHighlightText.innerHTML = "<b>" + '"' + hlText.substring(0, 25) + "... " + "<br>" + "..." + hlText.substring(hlText.length-25, hlText.length) + '"' + "</b>";
                    }

                    highlightText.appendChild(actualHighlightText);
                    insertDiv.appendChild(highlightText);

                    if (highlights[i].annotation){
                        annotation.innerHTML = highlights[i].annotation;
                    } else {
                        annotation.innerHTML = "No Annotations Found.";
                    }

                    annotation.className = "modalAnnotation";

                    $(annotation).on("mouseenter", function () {
                        console.log("inside");
                        annotation.appendChild(document.getElementsByClassName("modalIconHolder")[0]);
                        document.getElementsByClassName("modalIconHolder")[0].style.visibility = "visible";
                    }).on("mouseleave", function () {
                        console.log("outside");
                        document.getElementsByClassName("modalIconHolder")[0].style.visibility = "hidden";
                        document.body.appendChild(document.getElementsByClassName("modalIconHolder")[0]);
                    });

                    insertDiv.appendChild(annotation);

                    document.getElementsByClassName("modalBody")[0].appendChild(insertDiv);
                }
            })
        })

        /** Closes modal */
        $(".modalClose").on("click", function () {
            document.getElementById("modalPopup").style.display = "none";
        });
    })
})

/** Functions originally in the repository.html file */
function toggleNav() {
    if (document.getElementById("sideMenu").style.width === "250px"){
        closeNav();
    } else {
        openNav();
    }
}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("sideMenu").style.width = "250px";
    document.getElementById("main").style.marginLeft = "200px";
    $(".sidenavanchor").each(function (index, element) {
        element.style.visibility = "visible";
    });
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("sideMenu").style.width = "50px";
    document.getElementById("main").style.marginLeft = "0px";
    $(".sidenavanchor").each(function (index, element) {
        element.style.visibility = "hidden";
    });
}

function toggleDropdown(dropdown){
    if (dropdown.style.height != "0px"){
        console.log(dropdown.style.height);
        console.log("closing dropdown");

        closeDropdown(dropdown);
    } else {
        console.log("opening dropdown");
        openDropdown(dropdown);
    }
}

function openDropdown(dropdown){
    dropdown.style.height = dropdown.querySelectorAll(".dropdownSitesUrl").length * 40 + "px";

    $(dropdown.querySelectorAll(".dropdownSitesUrl")).each(function (index, element){
        element.style.visibility = "visible";
    })
}

function closeDropdown(dropdown){

    let siteLength = dropdown.querySelectorAll(".dropdownSitesUrl").length;
    let reversed = dropdown.querySelectorAll(".dropdownSitesUrl");

    dropdown.style.height = "0px";

    $(reversed).each(function (index, element){
        element.style.visibility = "hidden";
    })
}