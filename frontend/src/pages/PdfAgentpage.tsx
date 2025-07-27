import AIChat from "@/components/AIChat";
import PDFViewer from "@/components/PDFViewer";
import { useState } from "react";

type Props = {};

function PdfAgentpage({}: Props) {
  const [checkPageNumber, setCheckPageNumber] = useState<number | null>(null);

  return (
    <div className="w-full h-full flex overflow-hidden gap-2.5">
      <AIChat checkpageref={setCheckPageNumber} />
      <PDFViewer refPageNume={checkPageNumber} />
    </div>
  );
}

export default PdfAgentpage;
