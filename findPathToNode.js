function findPathToNodeTry2(node){

    console.log("findPathToNodeTry2 called");
    console.log("node.parentNode.hasChildNodes: " + node.parentNode.hasChildNodes());

    /** Instead of swimming up to the HTML element,
     *  Swim down from the HTML element. This will be significantly more taxing, but might work better as there
     *  will be no bias for what the first childNode of a parent is when calling childNodes
     */


    let htmlElement = document.documentElement;

    let indexArrayTopDown = new Array();

    swimDown(htmlElement, new Array());


    console.log("About to log the items in indexArrayTopDown");
    for (let i = 0; i < indexArrayTopDown.length; i++){
        console.log("The #" + i + " item in indexArrayTopDown is: " + indexArrayTopDown[i]);
    }
    return indexArrayTopDown;


    function swimDown(currentNode, currentArray){
        if (!(indexArrayTopDown.length === 0)){
            //console.log("indexArrayTopDown's length was greater than zero");
            return false;
        }
        if (!(currentNode.hasChildNodes()) && !(currentNode.isSameNode(node))){
            ;
        }
        else {
            $(currentNode.childNodes).each(function (index, element){
                if (element.isEqualNode(node)){
                    currentArray.push(index);
                    indexArrayTopDown = currentArray;
                    console.log("found the node!");
                    return false;
                } else {
                    let cloneArray = [].concat(currentArray);
                    cloneArray.push(index);
                    swimDown(element, cloneArray);
                }
            })
        }
    }
}

/** First attempt at findPathToNode. Not used.
 function findPathToNode(node){
    console.log("findPathToNode called");

    let currentNode = node;
    let index;
    let indexArray = [];
    while (!(currentNode.isSameNode(document.documentElement))){
        index = 0;
        $(node.parentNode.childNodes).each(function (index, element){
            if (element.isSameNode(currentNode)){
                return false;
            } else {
                index++;
            }
        })
        indexArray.push(index);
        console.log(currentNode.tagName);
        currentNode = currentNode.parentNode;
    }
    console.log(currentNode.tagName);

    indexArray.reverse();

    for (let i = 0; i < indexArray.length; i++){
        console.log(indexArray[i]);
    }
    return indexArray;
} */