
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';


export interface PdfChunk {
    content: string;
    chunkIndex: number;
    page: number;
}

function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }
    return chunks;
}

export async function extractChunksWithPageNumbers(
    buffer: Buffer | Uint8Array,
    chunkSize = 1000,
    overlap = 200
): Promise<PdfChunk[]> {

    const data = new Uint8Array(buffer);
    const pdf = await getDocument({ data }).promise;

    // const pdf = {} as any
    const chunks: PdfChunk[] = [];
    let chunkIndex = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');

        if (!pageText.trim()) continue;
        const splits = chunkText(pageText.trim(), chunkSize, overlap);

        splits.forEach(chunk => {
            chunks.push({
                content: chunk,
                chunkIndex: chunkIndex++,
                page: i
            });
        });
    }

    return chunks;
}

