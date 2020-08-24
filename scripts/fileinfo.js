const path = require("path");
const fs = require("fs");
export class fileDetails {
  constructor(filePath, capitalize) {
    this.sourcePath = `${filePath.dir}${path.sep}${filePath.base}`;
    this.extension = capitalize
      ? filePath.ext.slice(1).toUpperCase()
      : filePath.ext.slice(1);
    this.newPath = `${filePath.dir}${path.sep}${this.extension}${path.sep}${filePath.base}`;
    this.newFolder = `${filePath.dir}${path.sep}${this.extension}${path.sep}`;
  }
}
