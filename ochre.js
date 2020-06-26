const notifier = require("node-notifier");
const tt = require('electron-tooltip');
const path = require('path');
const fs = require('fs');
const tmp = require('tmp');
const glob = require('glob');
const { exec, spawn } = require('child_process');
const {dialog} = require('electron').remote;
const {app} = require('electron').remote;
const remote = require('electron').remote;
let client = remote.getGlobal('client');
tt({position: 'right'})

function setlocation() {
  let projectFolder = dialog.showOpenDialogSync({properties: ["openDirectory"]});
  if (projectFolder){
    document.getElementById("pdfdir").value = projectFolder;
  }
}

function ocr() {
  try {
    const tempdir = tmp.dirSync();
    burst_pdf(input, path.join(tempdir, "out-%05d.png"));
    for (const f in glob.sync(path.join(tempdir, "*.png"))) {
      let outname = path.join(tempdir, "*.png");
      ocr_file(f, outname);
    pdfs = glob.sync(path.join(tempdir, "*.pdf")).sort();
    joined_file = path.join(tempdir, "joined.pdf");
    join_pdfs(pdfs, joined_file);
    scale_pdf(joined_file, output);
    }
  } finally {
    tempdir.removeCallback();
  }
}

function burst_pdf(input, output) {
  exec('win/gs/bin/gswin64.exe', ["-o", output, "-sDEVICE=png16m",
           "-r300", "-dPDFFitPage=true", input], (err, stdout, stderr) => {
  	if (err) {
  		console.error(err);
  		return;
  	}
  	console.log(stdout);
  });
}

function ocr_file(input, outname) {
  spawn('win/Tesseract-OCR/tesseract.exe', [input, outname, "pdf"], (err, stdout, stderr) => {
  	if (err) {
  		console.error(err);
  		return;
  	}
  	console.log(stdout);
  });
}

function join_pdfs(inputs, output) {
  spawn('win/PDFtk/bin/PdftkXp.exe', [inputs, "cat", "output", output], (err, stdout, stderr) => {
  	if (err) {
  		console.error(err);
  		return;
  	}
  	console.log(stdout);
  });
}

function scale_pdf(input, output) {
  spawn('win/gs/bin/gswin64.exe', ["-sDEVICE=pdfwrite", "-sPAPERSIZE=letter", "-dFIXEDMEDIA", "-dPDFFitPage", "-o", output, input], (err, stdout, stderr) => {
  	if (err) {
  		console.error(err);
  		return;
  	}
  	console.log(stdout);
  });
}

document.getElementById("ocr").addEventListener("click", ocr);
document.getElementById("pdfdir").addEventListener("click", setlocation);