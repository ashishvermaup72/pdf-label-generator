// ======================================================
// BOOKSWAGON PDF LABEL GENERATOR
// VERSION 2 - PDF + EXCEL
// ======================================================

const { jsPDF } = window.jspdf;


// ======================================================
// PAGE ELEMENTS
// ======================================================

const manualInput = document.getElementById("manualInput");
const excelInput = document.getElementById("excelInput");

const excelFileInput = document.getElementById("excelFile");

const previewArea = document.getElementById("previewArea");
const status = document.getElementById("status");

const startBoxInput = document.getElementById("startBox");
const endBoxInput = document.getElementById("endBox");
const repeatInput = document.getElementById("repeatCount");

const pageSizeInput = document.getElementById("pageSize");

const customSize = document.getElementById("customSize");
const customWidth = document.getElementById("customWidth");
const customHeight = document.getElementById("customHeight");

const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");


// ======================================================
// EXCEL PO STORAGE
// ======================================================

let uploadedPOs = [];


// ======================================================
// INPUT MODE
// ======================================================

document
    .querySelectorAll('input[name="inputMode"]')
    .forEach((radio) => {

        radio.addEventListener("change", () => {

            if (radio.value === "manual" && radio.checked) {

                manualInput.classList.remove("hidden");
                excelInput.classList.add("hidden");

            }

            if (radio.value === "excel" && radio.checked) {

                manualInput.classList.add("hidden");
                excelInput.classList.remove("hidden");

            }

            updatePreview();

        });

    });


// ======================================================
// GET MANUAL PO NUMBERS
// ======================================================

function getManualPOs() {

    const inputs =
        document.querySelectorAll(".po-input");

    const pos = [];

    inputs.forEach((input) => {

        const value =
            input.value.trim();

        if (value !== "") {

            pos.push(value);

        }

    });

    return pos;

}


// ======================================================
// GET ALL PO NUMBERS
// ======================================================

function getPOs() {

    const selectedMode =
        document.querySelector(
            'input[name="inputMode"]:checked'
        );

    if (!selectedMode) {
        return [];
    }

    if (selectedMode.value === "excel") {

        return uploadedPOs;

    }

    return getManualPOs();

}


// ======================================================
// BOX SETTINGS
// ======================================================

function getBoxSettings() {

    return {

        start:
            parseInt(startBoxInput.value),

        end:
            parseInt(endBoxInput.value),

        repeat:
            parseInt(repeatInput.value)

    };

}


// ======================================================
// VALIDATE INPUT
// ======================================================

function validateSettings() {

    const {
        start,
        end,
        repeat
    } = getBoxSettings();


    if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        Number.isNaN(repeat)
    ) {

        alert(
            "Please enter valid box settings."
        );

        return false;

    }


    if (start < 1) {

        alert(
            "Start Box must be 1 or greater."
        );

        return false;

    }


    if (end < start) {

        alert(
            "End Box cannot be smaller than Start Box."
        );

        return false;

    }


    if (repeat < 1 || repeat > 10) {

        alert(
            "Repeat Per Box must be between 1 and 10."
        );

        return false;

    }


    return true;

}


// ======================================================
// CREATE ALL LABELS
// ======================================================

function createLabels() {

    const pos = getPOs();

    const {
        start,
        end,
        repeat
    } = getBoxSettings();


    const labels = [];


    pos.forEach((po) => {

        for (
            let box = start;
            box <= end;
            box++
        ) {

            for (
                let copy = 1;
                copy <= repeat;
                copy++
            ) {

                labels.push({

                    po: po,

                    box: box,

                    copy: copy

                });

            }

        }

    });


    return labels;

}


// ======================================================
// PAGE SIZE
// ======================================================

function getPageSize() {

    const selected =
        pageSizeInput.value;


    // 4 × 6 inch
    if (selected === "4x6") {

        return {

            width: 101.6,

            height: 152.4,

            name: "4x6"

        };

    }


    // A4
    if (selected === "a4") {

        return {

            width: 210,

            height: 297,

            name: "A4"

        };

    }


    // 70 × 35 mm
    if (selected === "70x35") {

        return {

            width: 70,

            height: 35,

            name: "70x35"

        };

    }


    // Custom
    if (selected === "custom") {

        const width =
            parseFloat(customWidth.value);

        const height =
            parseFloat(customHeight.value);


        if (
            !width ||
            !height ||
            width <= 0 ||
            height <= 0
        ) {

            return null;

        }


        return {

            width: width,

            height: height,

            name: `${width}x${height}`

        };

    }


    return null;

}


// ======================================================
// HTML SAFE TEXT
// ======================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// UPDATE PREVIEW
// ======================================================

function updatePreview() {

    const pos = getPOs();


    if (pos.length === 0) {

        previewArea.innerHTML =
            "<p>Your label preview will appear here.</p>";

        status.textContent =
            "Ready";

        return;

    }


    if (!validateSettings()) {

        return;

    }


    const labels =
        createLabels();


    if (labels.length === 0) {

        previewArea.innerHTML =
            "<p>No labels available.</p>";

        return;

    }


    // Only show first 12 in browser
    const previewLimit = 12;

    const previewLabels =
        labels.slice(0, previewLimit);


    let html = "";


    previewLabels.forEach((label) => {

        html += `

            <div style="
                border:1px solid #ccc;
                padding:15px;
                margin:6px;
                background:#fff;
                display:inline-block;
                min-width:150px;
                text-align:center;
            ">

                <strong>
                    ${escapeHTML(label.po)}
                </strong>

                <br>

                BOX ${label.box}

            </div>

        `;

    });


    if (labels.length > previewLimit) {

        html += `

            <div style="
                width:100%;
                text-align:center;
                padding:15px;
                color:#666;
            ">

                Showing first
                ${previewLimit}
                labels.

                <br>

                Total labels:
                <strong>${labels.length}</strong>

            </div>

        `;

    }


    previewArea.innerHTML =
        html;


    status.textContent =
        `Total Labels: ${labels.length}`;

}


// ======================================================
// EXCEL UPLOAD
// ======================================================

excelFileInput.addEventListener(
    "change",
    async (event) => {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        try {

            status.textContent =
                "Reading Excel file...";


            const data =
                await file.arrayBuffer();


            const workbook =
                XLSX.read(
                    data,
                    {
                        type: "array"
                    }
                );


            const firstSheet =
                workbook.Sheets[
                    workbook.SheetNames[0]
                ];


            const rows =
                XLSX.utils.sheet_to_json(
                    firstSheet,
                    {
                        header: 1,
                        defval: ""
                    }
                );


            uploadedPOs = [];


            rows.forEach((row, index) => {

                if (
                    !row ||
                    row.length === 0
                ) {

                    return;

                }


                const value =
                    String(
                        row[0]
                    ).trim();


                if (value === "") {

                    return;

                }


                // Ignore common header names
                const normalized =
                    value
                        .toLowerCase()
                        .replace(/\s+/g, " ")
                        .trim();


                const headers = [
                    "po",
                    "po number",
                    "po no",
                    "po no.",
                    "po_number",
                    "purchase order"
                ];


                if (
                    index === 0 &&
                    headers.includes(normalized)
                ) {

                    return;

                }


                uploadedPOs.push(value);

            });


            // Remove duplicates
            uploadedPOs =
                [...new Set(uploadedPOs)];


            if (
                uploadedPOs.length === 0
            ) {

                alert(
                    "No PO numbers found in the Excel file."
                );

                status.textContent =
                    "No PO numbers found.";

                return;

            }


            status.textContent =
                `${uploadedPOs.length} PO numbers loaded.`;


            updatePreview();

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to read the Excel file."
            );

            status.textContent =
                "Excel reading failed.";

        }

    }
);


// ======================================================
// PAGE SIZE CHANGE
// ======================================================

pageSizeInput.addEventListener(
    "change",
    () => {

        if (
            pageSizeInput.value ===
            "custom"
        ) {

            customSize.classList.remove(
                "hidden"
            );

        }

        else {

            customSize.classList.add(
                "hidden"
            );

        }


        updatePreview();

    }
);


// ======================================================
// INPUT EVENTS
// ======================================================

document
    .querySelectorAll(".po-input")
    .forEach((input) => {

        input.addEventListener(
            "input",
            updatePreview
        );

    });


startBoxInput.addEventListener(
    "input",
    updatePreview
);


endBoxInput.addEventListener(
    "input",
    updatePreview
);


repeatInput.addEventListener(
    "change",
    updatePreview
);


customWidth.addEventListener(
    "input",
    updatePreview
);


customHeight.addEventListener(
    "input",
    updatePreview
);


// ======================================================
// GENERATE PDF
// ======================================================

generateBtn.addEventListener(
    "click",
    () => {

        const pos =
            getPOs();


        // -------------------------------
        // PO VALIDATION
        // -------------------------------

        if (pos.length === 0) {

            alert(
                "Please enter at least one PO number."
            );

            return;

        }


        // -------------------------------
        // SETTINGS VALIDATION
        // -------------------------------

        if (!validateSettings()) {

            return;

        }


        // -------------------------------
        // PAGE VALIDATION
        // -------------------------------

        const page =
            getPageSize();


        if (!page) {

            alert(
                "Please enter valid page dimensions."
            );

            return;

        }


        // -------------------------------
        // CREATE LABELS
        // -------------------------------

        const labels =
            createLabels();


        if (labels.length === 0) {

            alert(
                "No labels to generate."
            );

            return;

        }


        status.textContent =
            "Generating PDF...";


        // -------------------------------
        // ORIENTATION
        // -------------------------------

        const orientation =
            page.width > page.height
                ? "landscape"
                : "portrait";


        // -------------------------------
        // CREATE PDF
        // -------------------------------

        const pdf =
            new jsPDF({

                orientation:
                    orientation,

                unit:
                    "mm",

                format: [
                    page.width,
                    page.height
                ]

            });


        // -------------------------------
        // GENERATE EACH LABEL
        // -------------------------------

        labels.forEach(
            (label, index) => {


                if (index > 0) {

                    pdf.addPage(
                        [
                            page.width,
                            page.height
                        ],
                        orientation
                    );

                }


                const centerX =
                    page.width / 2;

                const centerY =
                    page.height / 2;


                // ---------------------------
                // PO NUMBER
                // ---------------------------

                pdf.setFont(
                    "helvetica",
                    "bold"
                );


                pdf.setFontSize(18);


                pdf.text(
                    String(label.po),
                    centerX,
                    centerY - 6,
                    {
                        align: "center"
                    }
                );


                // ---------------------------
                // BOX NUMBER
                // ---------------------------

                pdf.setFontSize(25);


                pdf.text(
                    `BOX ${label.box}`,
                    centerX,
                    centerY + 9,
                    {
                        align: "center"
                    }
                );

            }
        );


        // ==================================================
        // FILE NAME
        // ==================================================

        let filePO =
            pos[0]
                .replace(
                    /[^a-zA-Z0-9_-]/g,
                    "_"
                );


        if (pos.length > 1) {

            filePO +=
                `_and_${pos.length}_POs`;

        }


        const fileName =
            `${filePO}_BOX_LABELS.pdf`;


        // ==================================================
        // DOWNLOAD
        // ==================================================

        pdf.save(
            fileName
        );


        // ==================================================
        // STATUS
        // ==================================================

        status.textContent =
            `PDF generated successfully — ${labels.length} labels`;

    }
);


// ======================================================
// RESET
// ======================================================

resetBtn.addEventListener(
    "click",
    () => {


        // Clear manual PO fields
        document
            .querySelectorAll(".po-input")
            .forEach((input) => {

                input.value = "";

            });


        // Clear Excel data
        uploadedPOs = [];


        excelFileInput.value =
            "";


        // Reset box settings
        startBoxInput.value =
            1;

        endBoxInput.value =
            10;

        repeatInput.value =
            1;


        // Reset page
        pageSizeInput.value =
            "4x6";


        customWidth.value =
            "";

        customHeight.value =
            "";


        customSize.classList.add(
            "hidden"
        );


        // Reset preview
        previewArea.innerHTML =
            "<p>Your label preview will appear here.</p>";


        // Reset status
        status.textContent =
            "Ready";

    }
);


// ======================================================
// INITIAL STATE
// ======================================================

manualInput.classList.remove(
    "hidden"
);

excelInput.classList.add(
    "hidden"
);

customSize.classList.add(
    "hidden"
);

status.textContent =
    "Ready";
