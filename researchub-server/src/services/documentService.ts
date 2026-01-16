import fs from "fs/promises";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import { PDFChunkMetadata } from "../models/Document";

export const SUPPORTED_FILE_TYPES = ["pdf", "docx", "doc", "txt"];

export type SupportedFileType = "pdf" | "docx" | "doc" | "txt";

export interface PDFParseResponse {
  text: string;
  pages: PDFChunkMetadata[];
}

export const PDF_CHUNK_SIZE = 6000; // ~1500 tokens

export async function readDocument(
  filePath: string,
  fileType: SupportedFileType
): Promise<PDFParseResponse> {
  switch (fileType) {
    case "pdf": {
      const dataBuffer = await fs.readFile(filePath);
      const pages: PDFChunkMetadata[] = [];
      let globalChunkIndex = 0;
      let fullDocumentText = "";
      const pageOffsets: { page: number; start: number; end: number }[] = [];

      const chunkText = (text: string, size: number) => {
        const chunks = [];
        let start = 0;

        while (start < text.length) {
          chunks.push(text.slice(start, start + size));
          start += size;
        }

        return chunks;
      };

      const options = {
        pagerender: (pageData: any) => {
          return pageData.getTextContent().then((textContent: any) => {
            const fullText = textContent.items
              .map((item: any) => item.str)
              .join(" ");

            // 🔹 Chunk across multiple pages based on chunk size
            const start = fullDocumentText.length;
            fullDocumentText += fullText + " ";
            const end = fullDocumentText.length;

            pageOffsets.push({
              page: pageData.pageIndex + 1,
              start,
              end,
            });

            return fullText;
          });
        },
      };

      const data = await pdf(dataBuffer, options);

      // 🔹 GLOBAL CHUNKING
      const chunks = chunkText(fullDocumentText, PDF_CHUNK_SIZE);

      chunks.forEach((chunk, idx) => {
        const chunkStart = idx * PDF_CHUNK_SIZE;
        const chunkEnd = chunkStart + chunk.length;

        // Find all pages covered by this chunk
        const coveredPages = pageOffsets
          .filter(
            (p) => chunkStart < p.end && chunkEnd > p.start // overlap logic
          )
          .map((p) => p.page);

        pages.push({
          chunkIndex: globalChunkIndex++,
          pages: coveredPages, // 👈 ARRAY now
          text: chunk.trim(),
        });
      });

      // console.log({ globalChunkIndex, size: pages.length });
      return { text: data.text, pages };
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
