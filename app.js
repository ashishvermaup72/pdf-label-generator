// ================================
// BOOKSWAGON PDF LABEL GENERATOR
// ================================

// ---------- INPUT MODE ----------

const inputMode = document.querySelectorAll(
    'input[name="inputMode"]'
);

const manualInput = document.getElementById("manualInput");
const excelInput = document.getElementById("excelInput");

inputMode.forEach((radio) => {

    radio.addEventListener("change", () => {

        if (radio.value === "manual" && radio.checked) {

            manualInput.classList.remove("hidden");
            excelInput.classList.add("hidden");

        }

        if (radio.value === "excel" && radio.checked) {

            manualInput.classList.add("hidden");
            excelInput.classList.remove("hidden");

        }

    });

});


// ---------- PAGE SIZE ----------

const pageSize = document.getElementById("pageSize");
const customSize = document.getElementById("customSize");

pageSize.addEventListener("change", () => {

    if (pageSize.value === "custom") {

        customSize.classList.remove("hidden");

    } else {

        customSize.classList.add("hidden");

    }

});


// ---------- PREVIEW ----------

const previewArea = document.getElementById("previewArea");

function getManualPOs() {

    const inputs = document.querySelectorAll(".po-input");

    const pos = [];

    inputs.forEach((input) => {

        const value = input.value.trim();

        if (value !== "") {
            pos.push(value);
        }

    });

    return pos;

}


function updatePreview() {

    const pos = getManualPOs();

    const startBox =
        parseInt(document.getElementById("startBox").value) || 1;

    const endBox =
        parseInt(document.getElementById("endBox").value) || 1;

    const repeat =
        parseInt(document.getElementById("repeatCount").value) || 1;


    if (pos.length === 0) {

        previewArea.innerHTML =
            "<p>Enter at least one PO number.</p>";

        return;

    }


    const po = pos[0];

    let html = "";

    let count = 0;

    for (let box = startBox; box <= endBox; box++) {

        for (let r = 0; r < repeat; r++) {

            count++;

            html += `
                <div style="
                    border:1px solid #ccc;
                    padding:15px;
                    margin:8px;
                    background:white;
                    display:inline-block;
                    min-width:180px;
                ">
                    <strong>${po}</strong><br>
                    BOX ${box}
                </div>
            `;

            if (count >= 10) {
                break;
            }

        }

        if (count >= 10) {
            break;
        }

    }


    previewArea.innerHTML = html;

}


// ---------- INPUT LISTENERS ----------

document.querySelectorAll(".po-input").forEach((input) => {

    input.addEventListener("input", updatePreview);

});

document
    .getElementById("startBox")
    .addEventListener("input", updatePreview);

document
    .getElementById("endBox")
    .addEventListener("input", updatePreview);

document
    .getElementById("repeatCount")
    .addEventListener("change", updatePreview);


// ---------- RESET ----------

document
    .getElementById("resetBtn")
    .addEventListener("click", () => {

        document
            .querySelectorAll(".po-input")
            .forEach((input) => {
                input.value = "";
            });

        document.getElementById("startBox").value = 1;

        document.getElementById("endBox").value = 10;

        document.getElementById("repeatCount").value = 1;

        document.getElementById("pageSize").value = "4x6";

        customSize.classList.add("hidden");

        document.getElementById("excelFile").value = "";

        previewArea.innerHTML =
            "<p>Your label preview will appear here.</p>";

        document.getElementById("status").textContent =
            "Ready";

    });


// ---------- GENERATE BUTTON ----------

document
    .getElementById("generateBtn")
    .addEventListener("click", () => {

        const pos = getManualPOs();

        if (pos.length === 0) {

            alert("Please enter at least one PO number.");

            return;

        }


        const startBox =
            parseInt(document.getElementById("startBox").value);

        const endBox =
            parseInt(document.getElementById("endBox").value);

        const repeat =
            parseInt(document.getElementById("repeatCount").value);


        if (endBox < startBox) {

            alert(
                "End Box cannot be smaller than Start Box."
            );

            return;

        }


        document.getElementById("status").textContent =
            "PDF generation module will be connected in the next step.";

        alert(
            "Input system is working.\n\n" +
            "PDF generation will be added next."
        );

    });


// ---------- INITIAL STATE ----------

manualInput.classList.remove("hidden");
excelInput.classList.add("hidden");

customSize.classList.add("hidden");

previewArea.innerHTML =
    "<p>Your label preview will appear here.</p>";
