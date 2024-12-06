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
            console.log(err);
            return null;
        }
    }

    writeBufferToFile = async (filePathStr, buffer) => {
        const filePath = path.join(this.#fileDirectoryPath, filePathStr);
        console.log(`writting file ${filePath}`);
        try {
            await fs.writeFile(filePath, buffer);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    } 
}

export { FileService };
