const prompt = require("prompt");
const path = require("path");
const fs = require("fs");

let prompt_attributes = [
  {
    name: "folderPath",
    description: "Enter the Folder Path",
    required: true,
    hidden: false,
  },
  {
    name: "Capitalize",
    type: "boolean",
    description: "Do you want the folder names to be Capitalized ? (true/false)",
    hidden: false,
  },
];
console.log("**********************************************");
console.log("**     WELCOME TO FOLDER ORGANIZE           **");
console.log("**********************************************");
console.log("\n");
console.log("This process will organize the files into folders based on there extension.\n For MAC: most of the paths will be /Users/youruserName/Downloads --> if you are organizing Downloads folder.\n For Windows C:\\users\\YouUserName\\Downloads");
console.log("Please enter the folder you want to organize");
prompt.start();

prompt.get(prompt_attributes, function (err, result) {
  if (err) {
    console.log(err);
    return 1;
  } else {
    console.log("entered Path: " + result["folderPath"]);
    console.log("Checking the file directory");
    const sourceRootDir = result.folderPath;
    getFiles(result.folderPath, result.Capitalize, sourceRootDir);
    console.log("**************DONE*****************");
  }
});

/**
 * Get the file information and performs the operations recursively
 * @param {string} dirPath directory path to get the file info
 * @param {boolean} capitalFolderName whether to capitalize the folder names or not
 */
function getFiles(dirPath, capitalFolderName, sourceRootDir) {
  try {
    if (fs.existsSync(dirPath)) {
      const filesArr = fs.readdirSync(dirPath);
      // Keep track of the source root directory

      for (const item of filesArr) {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          // Recursively process subdirectories
          getFiles(fullPath, capitalFolderName, sourceRootDir);

          // After processing all files in directory, check if it's empty
          const remainingFiles = fs.readdirSync(fullPath);
          if (remainingFiles.length === 0 && !isMediaTypeFolder(fullPath)) {
            // Remove empty directory only if it's not a media type folder
            fs.rmdirSync(fullPath);
            console.log(`Removed empty directory: ${fullPath}`);
          }
        } else {
          // Process files
          const filepath = path.parse(fullPath);
          if (filepath.ext) {
            const fileInfo = new fileDetails(filepath, capitalFolderName);

            // Create media type folder in the source root directory
            const mediaTypeFolder = path.join(sourceRootDir, fileInfo.extension);
            if (!fs.existsSync(mediaTypeFolder)) {
              fs.mkdirSync(mediaTypeFolder, { recursive: true });
            }

            // Set new path in the media type folder
            const newPath = path.join(mediaTypeFolder, filepath.base);

            // Skip if the file is already in its correct media type folder
            if (path.dirname(fullPath) === mediaTypeFolder) {
              console.log(`File ${filepath.base} is already in the correct folder`);
              continue;
            }

            console.log(`Moving file: ${fullPath} to ${newPath}`);

            try {
              // Handle case where file might already exist
              if (fs.existsSync(newPath)) {
                // Add a timestamp to make filename unique
                const fileExt = path.extname(filepath.base);
                const fileNameWithoutExt = path.basename(filepath.base, fileExt);
                const timestamp = new Date().getTime();
                const newFileName = `${fileNameWithoutExt}_${timestamp}${fileExt}`;
                const uniquePath = path.join(mediaTypeFolder, newFileName);
                fs.copyFileSync(fullPath, uniquePath);
                console.log(`File already exists, created copy as: ${newFileName}`);

                // Delete original file after successful copy
                fs.unlinkSync(fullPath);
              } else {
                // Copy file to new location
                fs.copyFileSync(fullPath, newPath);

                // Delete original file after successful copy
                if (fs.existsSync(newPath)) {
                  fs.unlinkSync(fullPath);
                  console.log("File moved successfully");
                } else {
                  console.log("Failed to move file, please check manually");
                }
              }
            } catch (err) {
              console.log(`Error moving file ${filepath.base}: ${err.message}`);
            }

            console.log("*****************************************");
          }
        }
      }
    } else {
      console.log("Not a valid path. Please check the Path and try again.");
    }
  } catch (error) {
    console.log(error);
  }
}

// Helper function to check if a folder is a media type folder
function isMediaTypeFolder(folderPath) {
  const folderName = path.basename(folderPath).toUpperCase();
  // Add more media types as needed
  const mediaTypes = ["PDF", "TXT", "DOC", "DOCX", "XLS", "XLSX", "JPG", "JPEG", "PNG", "MP3", "MP4"];
  return mediaTypes.includes(folderName);
}

class fileDetails {
  constructor(filePath, capitalize) {
    this.sourcePath = `${filePath.dir}${path.sep}${filePath.base}`;
    this.extension = capitalize ? filePath.ext.slice(1).toUpperCase() : filePath.ext.slice(1);
    this.newPath = `${filePath.dir}${path.sep}${this.extension}${path.sep}${filePath.base}`;
    this.newFolder = `${filePath.dir}${path.sep}${this.extension}${path.sep}`;
  }
}
