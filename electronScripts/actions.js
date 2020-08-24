import { getFiles } from "../scripts/fileaction.js";
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
});

document.getElementById("organize").addEventListener("click", organize);

function organize() {
  document.getElementById("success").classList.add("hide");
  showLoader();
  let fileControl = document.getElementById("filePath");
  let capitalSelect = document.getElementById("capitalizeSelect");

  // values
  let filesList = fileControl.files;
  let capitalSelected = capitalSelect.checked;

  if (filesList.length > 0) {
    let selectedPath = stripFileName(filesList[0]);
    getFiles(selectedPath, capitalSelected);
    success();
  } else alert("Please select a folder with files in it.");
  /**
   * strips the file name and returns the path of the selected item
   * @param {file} instr Complete File Path
   * @returns {string} file path
   */
  function stripFileName(inFile) {
    let selPath = null;
    selPath = inFile.path.replace(inFile.name, "");
    return selPath;
  }
  hideLoader();
}

function showLoader() {
  document.getElementById("overlay").style.display = "flex";
}
function hideLoader() {
  document.getElementById("overlay").style.display = "none";
}

function updateLoaderInfo(text) {
  document.getElementById("loader_text").innerHTML = text;
}

function success() {
  document.getElementById("success").classList.remove("hide");
}
