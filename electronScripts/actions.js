import { getFiles } from "../scripts/fileaction.js";
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
});

function organize() {
  let fileControl = document.getElementById("filePath");
  let capitalSelect = document.getElementById("capitalizeSelect");

  // values
  let filePath = fileControl.value;
  let capitalSelected = capitalSelect.value || true;
  if (filePath) {
    getFiles(filePath, capitalSelected);
  }
}
