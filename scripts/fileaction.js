const path = require("path");
const fs = require("fs");
import { fileDetails } from "./fileinfo.js";

/**
 * Get the file information and performs the operations
 * @param {string} dirPath directory path to get the file info
 * @param {boolean} capitalFolderName whether to capitalize the folder names or not
 */
export function getFiles(dirPath, capitalFolderName) {
  try {
    if (fs.existsSync(dirPath)) {
      const fillesArr = fs.readdirSync(dirPath);
      let filesInfos = fillesArr.map((x) => {
        let filepath = path.parse(dirPath + path.sep + x);
        if (filepath.ext) return new fileDetails(filepath, capitalFolderName);
      });
      //Removing unnecessary
      filesInfos = filesInfos.filter((e) => e);
      console.log("Files in the path");
      console.log(fillesArr);
      console.log("File Objects returned");
      console.log(filesInfos);
      console.log("Copying the files please wait.....");
      filesInfos.forEach((e) => {
        console.log(`Copying file: ${e.sourcePath} to ${e.newFolder}`);
        if (!fs.existsSync(e.newFolder)) fs.mkdirSync(e.newFolder);
        // Copying the file to new location
        fs.copyFileSync(e.sourcePath, e.newPath);
        // Checking if the file is copied to delete
        console.log("Checking if the file is copied successfully");
        if (fs.existsSync(e.newPath)) {
          console.log("File Copied successfully. Deleting from source...");
          fs.unlinkSync(e.sourcePath);
          console.log("Done Deleting the file");
        } else console.log(`Copied file doesn't exists. please check manually`);
        console.log("Done copying the file. on to next one");
        console.log("*****************************************");
      });
    } else
      console.log("Not a valid path. Please check the Path and try again.");
  } catch (error) {
    console.log(error);
  }
}
