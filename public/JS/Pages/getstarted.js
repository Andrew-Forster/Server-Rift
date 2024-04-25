const step1 = document.querySelector(".s1continue");
const content = document.getElementById("content");

const step1Content = "/HTML/Pages/Steps/step1.html";
const step2Content = "/HTML/Pages/Steps/step2.html";
const step3Content = "/HTML/Pages/Steps/step3.html";
const finalContent = "/HTML/Pages/Steps/final.html";
let currentStep = 1;

// Step 1

//TODO: Make it so on the randoms server rift, when the combo box is changed, it enables the switch

step1.addEventListener("click", function () {
    contentReplace(step2Content);
    formLoad(2);
});


function contentReplace(step) {
    formSave(document.querySelectorAll("input"));
    currentStep++;
    content.children[0].classList.add("continueAnim");

    setTimeout(function () {
        fetch(step)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
            })
            .catch(error => {
                location.reload();
                console.error('Error loading content:', error);
            });

    }, 900);

    setTimeout(function () {
        content.children[0].classList.add("active");

        if (step === step2Content) {
            try {
                const step2 = document.querySelector(".s2continue");
                step2.addEventListener("click", function () {
                    contentReplace(step3Content);
                    formLoad(3);
                });
            } catch (e) {
                location.reload();
            }

        }

        if (step === step3Content) {
            try {
                const step3 = document.querySelector(".s3login");
                step3.addEventListener("click", function () {
                    contentReplace(finalContent);
                });
            } catch (e) {
                location.reload();
            }


        }
    }, 1200);
};




// Save Form Data





function formSave(data) {

    let checkboxStates = {};

    data.forEach(function (item) {
        if (item.type === "checkbox") {
            checkboxStates[item.id] = item.checked;
        }
    });

    localStorage.setItem("form" + currentStep, JSON.stringify(checkboxStates));

}

function formLoad(cs) {
    this.setTimeout(function () {
        let data = JSON.parse(localStorage.getItem("form" + cs));

        if (data) {
            Object.keys(data).forEach(function (key) {
                document.getElementById(key).checked = data[key];
            });
        }
    }, 1000);
}

window.addEventListener("load", function () {
    formLoad("1");
});

window.addEventListener("beforeunload", function () {
    formSave(document.querySelectorAll("input"));
});
