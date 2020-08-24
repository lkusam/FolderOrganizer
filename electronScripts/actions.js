import { getFiles } from "../scripts/fileaction.js";
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
});

document.getElementById("organize").addEventListener("click", organize);

function organize() {
  let fileControl = document.getElementById("filePath");
  let capitalSelect = document.getElementById("capitalizeSelect");

  // values
  let filesList = fileControl.files;
  let capitalSelected = capitalSelect.checked || true;

  if (filePath.Length > 0) {
    getFiles(filePath, capitalSelected);
  }
}
