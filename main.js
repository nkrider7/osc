const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb } = PDFLib;

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

submitBtn.addEventListener("click", () => {
  const val = capitalize(userName.value);

  //check if the text is empty or not
  if (val.trim() !== "" && userName.checkValidity()) {
    // console.log(val);
    generatePDF(val);
  } else {
    userName.reportValidity();
  }
});

const generatePDF = async (name) => {
  try {
    const existingPdfBytes = await fetch("./src/temp.pdf").then((res) =>
      res.arrayBuffer()
    );
    const fontBytes = await fetch("./src/font/Deja.ttf").then((res) => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);


    const customFont = await pdfDoc.embedFont(fontBytes);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // Draw a string of text diagonally across the first page
    firstPage.drawText(name, {
      x: 295,
      y: 310,
      size: 30,
      font: customFont,
      color: rgb(0, 0.53, 0.71),
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    console.log("Done creating");

    // Create a File object and download
    var file = new File(
      [pdfBytes],
      "Certificate.pdf",
      {
        type: "application/pdf;charset=utf-8",
      }
    );
    saveAs(file);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
