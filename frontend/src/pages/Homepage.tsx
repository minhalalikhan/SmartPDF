import React from "react";

import UploadHandler from "@/components/UploadHandler";

type Props = {};

function Homepage({}: Props) {
  return (
    <>
      <div className="flex flex-col items-center w-full gap-[20px] p-[20px]">
        <h1 className="text-5xl font-extrabold">Welcome to SmartPDF</h1>
        <h3 className="text-2xl">Your Smart AI PDF assistant</h3>
      </div>

      <UploadHandler />
    </>
  );
}

export default Homepage;
