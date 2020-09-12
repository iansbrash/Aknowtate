/** TODO: PROBLEMS WITH CURRENT highlightTry6
 * TODO: Messes up if you delete a highlight that isn't the most recent
 * TODO: Messes up if you clear the page of highlights and then re-highlight the area that was deleted
 * TODO: Relies too much on the exact DOM structure. If the page is changed in ANY WAY, the highlighting fails. */

/** How to fix these problems:
 *  Use alternate method that doesn't swim up and down
 *  Treat highlighted texts differently so the swim up/down method doesn't care if something is highlighted and doesn't treat it like say, 3 seperate elements instead of 1
 *  Create a copy of the page on load, and store the highlights with respect to that copy, instead of the document the user is viewing.
 *      Potentially fixes the current issues of deleting / highlighting old news.
 *  Use a 'query selector' method like the old highlight extension I was referencing.
 *
 *  When highlighting a paragraph between two other paragraphs, the old highlight method goes into the paragraph until it is a the bottommost element or node, and highlights that.
 *      Aka, it doesn't just add "style="backgroundColor:yellow;"" to the topmost <p> element
 *
 *  Make it impossible to highlight an area that is already highlighted. (stops highlight collision)
 *
 *  Other thoughts: Reddit probably uses Date.time() to index each post as it loads on the page, and this is why reddit doesn't work when this extension is on.
 *  Need to make the ID something like 123986958123-Aknowtate instead of 123986958123
 *
 */

/** Add functionality to paste a highlight somewhere else, aka move the highlight but preserve the annotation and other settings */
/** Maybe wrap the beginning/ends in another span so that when going over it, it still looks like a single element (instead of 2 or 3) */


/** Instead of highlighting each node as we go, put all nodes we need to highlight into an array, and once we're done, iterate through the array and highlight.
 *  This lets us check if a node has already been highlighted (and will let us cancel the actual highlighting operation */

/** TODO: To-do. */

 function highlightRewritten(selection, container, anchorNode, focusNode, anchorOffset, focusOffset, highlightColor, uniqueId){
    // NOTE: Look at highlightTry6 for the current highlight function
}
