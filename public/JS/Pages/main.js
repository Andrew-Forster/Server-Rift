
// -------------------
// Main Text Animation
// -------------------
var mainText = "The new way to find discord servers "
var mainTextArray = mainText.split("");
var mainTextElement = document.getElementById("main-text");


var spacesCount = mainText.split(" ").length - 1;
var breakPlaced = false;
addMainText();


function addMainText() {
    for (var i = 0; i < mainTextArray.length; i++) {
        mainTextElement.insertAdjacentHTML("beforeend", "<span>" + mainTextArray[i] + "</span>");
        
        if (i >= mainTextArray.length/2 && mainTextArray[i] == " " && !breakPlaced) {
            mainTextElement.insertAdjacentHTML("beforeend", "<br>")
            breakPlaced = true;
        }
    }
    for (var i = 0; i < mainTextElement.children.length; i++) {
        mainTextElement.children[i].style.animationDelay = (0.5 + i / 15) + "s";
    }
}
// --------------------------
// END OF Main Text Animation
// --------------------------


// Alert Popup