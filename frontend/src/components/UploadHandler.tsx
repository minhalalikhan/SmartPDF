import { usePDFStore } from "@/store/pdfstore";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router";

type Props = {};

function UploadHandler({}: Props) {
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    clearPDF,
    pdfFile,
    setPDF,
    uploadError,
    uploadProgress,
    uploadSuccess,
    uploading,
  } = usePDFStore();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);

    clearPDF();
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection?.errors?.length > 0) {
        const message = rejection.errors[0].message;
        setError(`Upload failed: ${message}`);
        return;
      }
    }

    if (acceptedFiles.length > 1) {
      setError("Only one file is allowed.");
      return;
    }

    const thispdfFile = acceptedFiles[0];

    if (thispdfFile && thispdfFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setPDF(thispdfFile);
  }, []);

  function cancelUpload(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    clearPDF();
    setError(null);
  }

  function handlegotoPdfAgent(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (pdfFile) {
      navigate("/pdf-agent");
    } else {
      setError("Please upload a PDF file first.");
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-container  rounded-md p-4 cursor-pointer transition ${
        isDragActive ? "border-blue-400 border bg-blue-200" : ""
      }`}
    >
      <input {...getInputProps()} />
      <h3 className="font-bold text-lg mb-2">Upload your PDF</h3>

      {!pdfFile && !error && (
        <>
          <p className="text-sm text-gray-500 text-center mt-[100px]">
            Click here to upload a file or drag and drop your PDF into this area
          </p>
          {/* <p className="text-sm text-gray-500 mb-2">Uploading...{50}%</p>
          <CircularProgress
            value={50}
            sx={{ color: "blue", width: "100px", height: "100px" }}
            variant="determinate"
          />
          <button
            className="border-red-500 border-2 cursor-pointer rounded-[20px] px-4 py-1.5"
            onClick={cancelUpload}
          >
            remove
          </button> */}
        </>
      )}

      {uploadSuccess && (
        <div className="mt-[70px] text-center text-sm text-gray-500 flex flex-col items-center gap-[10px]">
          <p>Your Smart PDF is ready ! </p>
          <button
            className="bg-gray-900 text-white rounded-[20px] text-[18px]  px-4 py-1.5 cursor-pointer"
            onClick={handlegotoPdfAgent}
          >
            check Smart PDF
          </button>
          <div className="gap-[10px] flex justify-center items-center">
            <button
              className="border-gray-500 border-2 cursor-pointer rounded-[20px] px-4 py-1.5"
              onClick={cancelUpload}
            >
              remove
            </button>
            <button className="border-gray-500 border-2 cursor-pointer rounded-[20px] px-4 py-1.5">
              replace
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-[100px] text-center text-sm text-gray-500 ">
          <p className=" text-red-600 text-sm text-center"> {error}</p>
          <p className="text-sm text-gray-500 text-center">
            Click here to upload a file or drag and drop your PDF into this area
          </p>
        </div>
      )}

      {uploading && (
        <div className="mt-[100px] text-center flex flex-col items-center gap-[10px]">
          <p className="text-sm text-gray-500 mb-2">
            Uploading...{uploadProgress}%
          </p>
          <CircularProgress
            value={uploadProgress}
            sx={{ color: "red", width: "50px", height: "50px" }}
            variant="determinate"
          />
          <button
            className="border-red-500 border-2 cursor-pointer rounded-[20px] px-4 py-1.5"
            onClick={cancelUpload}
          >
            remove
          </button>
        </div>
      )}

      {uploadError && !error && (
        <div className="mt-[100px] text-center text-sm text-gray-500 ">
          <p className=" text-red-600 text-sm text-center">Upload failed</p>
          <p className="text-sm text-gray-500 text-center ">
            Click here to upload a file or drag and drop your PDF into this area
          </p>
        </div>
      )}
    </div>
  );
}

export default UploadHandler;
