
import fs from "fs";

export class FileReaderService {

    private fileSystem: any;

    constructor() {
        this.fileSystem = fs;
    }

    public readEmailTemplate = (fileName: string, callback: CallableFunction) => {
        try {
            this.fileSystem.readFile("public/email-temp/" + fileName, "utf-8", callback);
        } catch (error) {
            console.log("error sss", error);
        }
    }

    public read(fileName: string) {

    }

}

export const fileReaderServiceIns = new FileReaderService();