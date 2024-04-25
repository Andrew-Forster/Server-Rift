// TODO LIST:
// 1. Add support for single execution of the reveal function
// 2. Add support for elements to be hidden after they have been scrolled past 
// 3. Add support for revealing elements on page reload


var triggerThreshold = 250; // Default trigger threshold, Controls where the animation is triggered in accordance to the trigger element top position.
let validClasses = [".sa-group" ,".sa", ".sa-zoom", ".sa-flip", ".sa-right", ".sa-shift", ".sa-custom", ".sa-bottom", ".sa-top"];

function reveal(classNames, elementVisible) {
    var elements = document.querySelectorAll(classNames.join(','));

    for (var i = 0; i < elements.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = elements[i].getBoundingClientRect().top;
        var parentEle = elements[i].parentElement;

        var dataValue = elements[i].getAttribute("data-sa-threshold");
        if (dataValue !== null) {
            elementVisible = dataValue;
        }

        switch (caseOperator(i, elementTop, windowHeight, elementVisible, parentEle, classNames, elements)) {
            case 1:
                elements[i].classList.add("active");
                break;
            case 2:
                elements[i].classList.remove("active");
                break;
            case 3:
                if (elementTop > windowHeight - elementVisible) {break;}
                elements[i].classList.add("active");
                addActiveChildren(elements[i], elements);
                
                break;
            case 4:
                if (elementTop < windowHeight - elementVisible) {break;}
                if (elements[i].classList.contains("sa-freeze")) {break;}
                elements[i].classList.remove("active");
                removeActiveChildren(elements[i], elements);
                break;
            case 5:
                if (elementTop > windowHeight - elementVisible) {break;}
                elements[i].classList.add("active");
                nestedAddActiveChildren(elements[i], elements);
                break;
            case 6:
                if (elementTop < windowHeight - elementVisible) {break;}
                if (elements[i].classList.contains("sa-freeze")) {break;}
                elements[i].classList.remove("active");
                nestedRemoveActiveChildren(elements[i], elements);
                break;
        }
    }
}
// Add event listener to trigger reveal function on scroll
window.addEventListener("scroll", function () {
    reveal(validClasses, triggerThreshold);
});

function caseOperator(index, ElementTop, WindowHeight, ElementVisible, ParentEle, classNames, elements) {
    
    // Add Active Class to Elements
    if (ElementTop < WindowHeight - ElementVisible && !elements[index].classList.contains("sa-group") && !ParentEle.classList.contains("sa-group")) {
        return 1;
    } else 
    // Remove Active Class from Elements
    if (!elements[index].classList.contains("sa-group") && !ParentEle.classList.contains("sa-group")) {
        return 2;
    } 
    // Add Active Class to Groups
    if (elements[index].classList.contains("sa-group") && !elements[index].classList.contains("active") && !checkGroupChildren(elements[index]) && !ParentEle.classList.contains("sa-group")) {
        return 3;
    } else 
    // Remove Active Class from Groups
    if (elements[index].classList.contains("sa-group") && elements[index].classList.contains("active") && !checkGroupChildren(elements[index]) && !ParentEle.classList.contains("sa-group")) {
        return 4;
    } 

    // Embedded groupings
    if (elements[index].classList.contains("sa-group") && !elements[index].classList.contains("active") && checkGroupChildren(elements[index])) {
        return 5;
    } else if (elements[index].classList.contains("sa-group") && elements[index].classList.contains("active") && checkGroupChildren(elements[index])) {
        return 6;
    }
}

function isFirstElementWithClass(element, ClassNames) {
    var prevElement = element.previousElementSibling;

    while (prevElement) {
        for (var i = 0; i < ClassNames.length; i++) {
            if (prevElement.classList.contains(ClassNames[i])) {
                return false; // Found a previous sibling with one of the specified classes
            }
        }
        prevElement = prevElement.previousElementSibling;
    }

    return true; // No previous sibling with one of the specified classes found, so it's the first child
}

function addActiveChildren(parentEle, element) {
    var children = parentEle.children;
    for (var i = 0; i < children.length; i++) {
        for (var j = 0; j < element.length; j++) {
            if (children[i] === element[j]) {
                children[i].classList.add("active");
            }
        }
    }
}

function removeActiveChildren(parentEle, element) {
    var children = parentEle.children;
    for (var i = 0; i < children.length; i++) {
        for (var j = 0; j < element.length; j++) {
            if (children[i] === element[j]) {
                children[i].classList.remove("active");
            }
        }
    }
}

function nestedAddActiveChildren(parentEle, element) {
    var children = parentEle.children;
    for (var i = 0; i < children.length; i++) {
        for (var j = 0; j < element.length; j++) {
            if (children[i] === element[j]) {
                children[i].classList.add("active");
                if (children[i].classList.contains("sa-group")) {
                    nestedAddActiveChildren(children[i], element);
                }
            }
        }
    }
}

function nestedRemoveActiveChildren(parentEle, element) {
    var children = parentEle.children;
    for (var i = 0; i < children.length; i++) {
        for (var j = 0; j < element.length; j++) {
            if (children[i] === element[j]) {
                children[i].classList.remove("active");
                if (children[i].classList.contains("sa-group")) {
                    nestedRemoveActiveChildren(children[i], element);
                }
            }
        }
    }
}

function checkGroupChildren(element) {
    var children = element.children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].classList.contains("sa-group")) {
            return true;
        }
    }
    return false;
}