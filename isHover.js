let prevColor;
let thisChunk;
/**


$( document ).on('mouseenter', ".AKNOWTATE-HIGHLIGHT", function(){
    if (!(this.style.background === "")){
        deleted = true;
        prevColor = this.style.background;
        thisChunk = this.classList[1];
        $("." + thisChunk).each(function(index, element){
            element.style.background = "green";
        })
    }
}).on("mouseleave", ".AKNOWTATE-HIGHLIGHT", function() {
    if (!(this.style.background === "")){
        $("." + thisChunk).each(function(index, element) {
            element.style.background = prevColor;
        })
    }

});


/** Function to use when clicking on the highlight */
/**
$(document).on("click,", ".AKNOWTATE-HIGHLIGHT", function(){
    $("#testDiv").style.visibility = "visible";
});


/** How to load HTML using jQuery: $(selected.load("blank.html"); */


