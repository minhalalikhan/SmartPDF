import AIChat from "@/components/AIChat";
import PDFViewer from "@/components/PDFViewer";
import { useChatStore } from "@/store/ChatStore";

import { useEffect, useState } from "react";

type Props = {};

function PdfAgentpage({}: Props) {
  const [checkPageNumber, setCheckPageNumber] = useState<number | null>(null);

  const { DeleteChat } = useChatStore();

  useEffect(() => {
    return () => {
      DeleteChat();
    };
  }, []);

  return (
    <div className="w-full h-full flex overflow-hidden gap-2.5">
      <AIChat checkpageref={setCheckPageNumber} />
      <PDFViewer refPageNume={checkPageNumber} />
    </div>
  );
}

export default PdfAgentpage;
