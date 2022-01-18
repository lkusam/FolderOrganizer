const prompt = require("prompt");
const path = require("path");
const fs = require("fs");

let prompt_attributes = [
  {
    name: "folderPath",
    description: "Enter the Folder Path",
    required: true,
    hidden: false
  },
  {
    name: "Capitalize",
    type: "boolean",
    description:
      "Do you want the folder names to be Capitalized ? (true/false)",
    hidden: false
  }
];
console.log("**********************************************");
console.log("**     WELCOME TO FOLDER ORGANIZE           **");
console.log("**********************************************");
console.log("\n");
console.log(
  "This process will organize the files into folders based on there extension.\n For MAC: most of the paths will be /Users/youruserName/Downloads --> if you are organizing Downloads folder.\n For Windows C:\\users\\YouUserName\\Downloads"
);
console.log("Please enter the folder you want to organize");
prompt.start();

prompt.get(prompt_attributes, function (err, result) {
  if (err) {
    console.log(err);
    return 1;
  } else {
    console.log("entered Path: " + result["folderPath"]);
    console.log("Checking the file directory");
    getFiles(result.folderPath, result.Capitalize);
    console.log("**************DONE*****************");
  }
});

/**
 * Get the file information and performs the operations
 * @param {string} dirPath directory path to get the file info
 * @param {boolean} capitalFolderName whether to capitalize the folder names or not
 */
function getFiles(dirPath, capitalFolderName) {
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

class fileDetails {
  constructor(filePath, capitalize) {
    this.sourcePath = `${filePath.dir}${path.sep}${filePath.base}`;
    this.extension = capitalize
      ? filePath.ext.slice(1).toUpperCase()
      : filePath.ext.slice(1);
    this.newPath = `${filePath.dir}${path.sep}${this.extension}${path.sep}${filePath.base}`;
    this.newFolder = `${filePath.dir}${path.sep}${this.extension}${path.sep}`;
  }
}
