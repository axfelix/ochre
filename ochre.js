const notifier = require("node-notifier");
const tt = require('electron-tooltip');
const path = require('path');
const fs = require('fs');
const tmp = require('tmp');
const glob = require('glob');
const commandJoin = require('command-join')
const { exec, execSync } = require('child_process');
const {dialog} = require('electron').remote;
const {app} = require('electron').remote;
const remote = require('electron').remote;
let client = remote.getGlobal('client');
tt({position: 'right'})

tmp.setGracefulCleanup()

function setlocation() {
  let projectFolder = dialog.showOpenDialogSync({properties: ["openDirectory"]});
  if (projectFolder){
    document.getElementById("pdfdir").value = projectFolder[0];
  }
}

function ocr() {
  buttonBlock = document.getElementById("ocr");
  buttonBlock.style.display = "none";
  fs.readdir(document.getElementById("pdfdir").value, function (err, files) {
    if (err) {
      return console.log("Couldn't parse directory path.");
    }
    files.forEach(function (file) {
        let input = path.join(document.getElementById("pdfdir").value, file);
        let tempdirObject = tmp.dirSync();
        let tempdir = tempdirObject.name;
        let outpath = path.join(tempdir, "out-%05d.png");
        execSync(commandJoin([path.join("win","gs","bin","gswin64c.exe"), "-o", path.join(tempdir, "%05d.png"), "-sDEVICE=png16m",
           "-r300", "-dPDFFitPage=true", input]));
        glob(path.join(tempdir, "*.png"), function (er, files) {
          files.forEach(f => execSync(commandJoin([path.join("win","Tesseract-OCR","tesseract.exe"), f, path.join(tempdir, path.parse(f).name), "pdf"])));
        });
        let pdfs = glob.sync(path.join(tempdir, "*.pdf")).sort();
        let joined_file = path.join(tempdir, "joined.pdf");
        execSync(commandJoin([path.join("win","PDFtk","bin","pdftk.exe"), pdfs, "cat", "output", joined_file]));
        let output = input.concat('.ocr.pdf')
        execSync(commandJoin([path.join("win","gs","bin","gswin64.exe"), "-sDEVICE=pdfwrite", "-sPAPERSIZE=letter", "-dFIXEDMEDIA", "-dPDFFitPage", "-o", output, joined_file]));
    });
  });
  buttonBlock.style.display = "block";
}

document.getElementById("ocr").addEventListener("click", ocr);
document.getElementById("pdfdir").addEventListener("click", setlocation);