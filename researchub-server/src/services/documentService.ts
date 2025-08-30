import fs from "fs/promises";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export const SUPPORTED_FILE_TYPES = ["pdf", "docx", "doc", "txt"];

export type SupportedFileType = "pdf" | "docx" | "doc" | "txt";

export async function readDocument(
  filePath: string,
  fileType: SupportedFileType
): Promise<string> {
  switch (fileType) {
    case "pdf": {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    }
    //TODO, testing and implementation pending for this file type
    // case "docx": {
    //   const dataBuffer = await fs.readFile(filePath);
    //   const result = await mammoth.extractRawText({ buffer: dataBuffer });
    //   return result.value;
    // }
    // case "txt": {
    //   const data = await fs.readFile(filePath, "utf8");
    //   return data;
    // }
    // case "doc": {
    //   throw new Error(
    //     "Reading .doc is not fully supported. Please convert to .docx"
    //   );
    // }
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
