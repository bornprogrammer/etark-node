"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileReaderServiceIns = exports.FileReaderService = void 0;
const fs_1 = __importDefault(require("fs"));
class FileReaderService {
    constructor() {
        this.readEmailTemplate = (fileName, callback) => {
            try {
                this.fileSystem.readFile("./src/public/email-temp/" + fileName, "utf-8", callback);
            }
            catch (error) {
                console.log("error sss", error);
            }
        };
        this.fileSystem = fs_1.default;
    }
    read(fileName) {
    }
}
exports.FileReaderService = FileReaderService;
exports.fileReaderServiceIns = new FileReaderService();
//# sourceMappingURL=FileReaderService.js.map