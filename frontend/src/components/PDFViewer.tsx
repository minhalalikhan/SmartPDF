import { useState, useEffect, useRef, useCallback } from "react";
import { pdfjs, Document, Page } from "react-pdf";

import { usePDFStore } from "@/store/pdfstore";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.31/build/pdf.worker.mjs";

type Props = {
  refPageNume: number | null;
};

function PDFViewer({ refPageNume }: Props) {
  const { pdfUrl } = usePDFStore();

  const [numPages, setNumPages] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Update container size on mount and window resize
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // When document is loaded, update number of pages
  function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
  }

  // Get first page's dimensions to calculate aspect ratio
  async function onFirstPageLoad(page: any) {
    const viewport = page.getViewport({ scale: 1 });
    setPageDimensions({ width: viewport.width, height: viewport.height });
  }

  const scrollToPage = useCallback((pageNumber: number) => {
    if (!containerRef.current) return;

    const pageElement = containerRef.current.querySelector(
      `[data-page-number="${pageNumber}"]`
    ) as HTMLElement | null;

    if (pageElement) {
      // Scroll the container so that the page element is at the top
      containerRef.current.scrollTo({
        top: pageElement.offsetTop,
        behavior: "smooth", // smooth scrolling
      });
    }
  }, []);

  useEffect(() => {
    if (refPageNume) scrollToPage(refPageNume || 1); // scroll to the specified page number or default to 1
  }, [refPageNume]);

  if (!pdfUrl)
    return (
      <div className="flex-1 h-full p-2 flex justify-center items-center">
        No PDF loaded
      </div>
    );

  if (containerSize.width === 0 || containerSize.height === 0)
    return <div ref={containerRef} className="flex-1 h-full p-2" />;

  // Calculate scaled width and height to fit page inside container while maintaining aspect ratio
  const pageRatio = pageDimensions.width / pageDimensions.height;
  const containerRatio = containerSize.width / containerSize.height;

  let scaledWidth = 0;
  let scaledHeight = 0;

  if (pageRatio > containerRatio) {
    // Page wider than container ratio -> limit width
    scaledWidth = containerSize.width;
    scaledHeight = containerSize.width / pageRatio;
  } else {
    // Page taller than container ratio -> limit height
    scaledHeight = containerSize.height;
    scaledWidth = containerSize.height * pageRatio;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full p-2 overflow-y-auto"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={`page_wrapper_${index + 1}`}
            data-page-number={index + 1} // add attribute to be able to find
            style={{
              width: scaledWidth,
              height: scaledHeight,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={scaledWidth}
              onLoadSuccess={index === 0 ? onFirstPageLoad : undefined} // get dimensions on first page only
            />
          </div>
        ))}
      </Document>
    </div>
  );
}

export default PDFViewer;
