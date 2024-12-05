import fs from "node:fs/promises";
import path from "node:path";

class FileService {
    #fileDirectoryPath

    /**
     *  Provides file services to other application layers
     *  @param {string} fileDirectoryPath - The directory this fileService will
     *  operate on
     */
    constructor(fileDirectoryPath) {
	this.#fileDirectoryPath = fileDirectoryPath;
    }

    fileAsBuffer = async (filePathStr) => {
	const filePath = path.join(this.#fileDirectoryPath, filePathStr);
	console.log(`reading file ${filePath}`);
	try {
	    const fileBuffer = await fs.readFile(filePath);
	    return fileBuffer;
	} catch (err) {
	    return null;
	}
    }
}

export { FileService };
