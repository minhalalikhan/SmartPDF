import { useEffect, useRef, useState } from "react";
import sendIcon from "@/assets/icons8-send-50.png";
import { useChatStore } from "@/store/ChatStore";
import { usePDFStore } from "@/store/pdfstore";
import { Link } from "react-router";

type Props = {
  checkpageref: Function;
};

function AIChat({ checkpageref }: Props) {
  // Chat array

  const { messages, thinking, ResponseStatus } = useChatStore();
  const { pdfUrl } = usePDFStore();

  const bottomRef = useRef<null | HTMLElement>(null);

  // const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scroll every time messages update

  return (
    <div className="flex-1 h-full  overflow-hidden flex flex-col gap-2 pt-1">
      {/* Notice */}
      {messages.length === 0 && pdfUrl && (
        <div className=" rounded-lg text-center p-2 notification">
          <h2 className="text-lg font-bold mb-2">Your PDF is ready</h2>
          <p className="text-sm text-gray-500">
            Ask questions about your PDF. The AI will respond based on the
            content of the uploaded PDF.
          </p>
        </div>
      )}

      {/* error notice */}
      {!pdfUrl && (
        <div className="  rounded-lg  text-center p-2 notification-alert">
          <h2 className="text-lg font-bold mb-2">No PDF loaded</h2>
          <p className="text-sm text-gray-500 mb-2.5">
            Please upload a PDF to start asking questions.
          </p>
          <Link to="/" className="font-bold underline">
            Go to Home page
          </Link>
        </div>
      )}

      {/* Render all messages */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto py-2 w-full">
        {messages.map((message, index) => {
          if (message.sender === "user")
            return <UserMessage message={message.content} key={index} />;

          {
            /* AI response */
          }
          return (
            <AIMessage
              message={message.content}
              key={index}
              checkpageref={checkpageref}
              citations={message.citations}
            />
          );
        })}

        {/* AI response  err*/}
        {ResponseStatus === "ERROR" && (
          <div className="rounded px-2 py-1 max-w-3/4 border border-red-400 bg-[#ffc9ca4a]">
            Oops! Unable to process your request. Please try again later. Or try
            updating the PDF.
          </div>
        )}

        {thinking && <ThinkingDots />}
      </div>

      {/* message panel */}
      <MessageInput />
    </div>
  );
}

function MessageInput() {
  const { askQuestion, thinking } = useChatStore();
  const { pdfUrl } = usePDFStore();

  function onMessageSend() {
    askQuestion(message);
    setMessage(""); // Clear input after sending
  }

  const [message, setMessage] = useState("");

  const disabled = !message || thinking || !pdfUrl;

  return (
    <div className="flex items-center gap-2 h-[50px] p-1 w-full">
      <input
        type="text"
        placeholder="Ask your question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <button
        disabled={disabled}
        onClick={onMessageSend}
        className={`rounded-3xl  ${
          disabled
            ? " opacity-50"
            : "cursor-pointer bg-gray-300 hover:bg-gray-200"
        } p-2  transition-colors `}
      >
        <img src={sendIcon} style={{ width: "24px", height: "24px" }} />
      </button>
    </div>
  );
}

const ThinkingDots = () => {
  return (
    <div className="flex items-center  px-2 gap-2 h-10">
      <div
        className="w-3 h-3 bg-gray-400 rounded-full animate-ping"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="w-3 h-3  bg-gray-400 rounded-full animate-ping"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-3 h-3  bg-gray-400 rounded-full animate-ping"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
};

function UserMessage({ message }: { message: string }) {
  return (
    <div className="rounded-4xl px-3 py-2 bg-gray-900 text-white max-w-2/3 self-end">
      {message}
    </div>
  );
}

function AIMessage({
  message,
  checkpageref,
  citations = [],
}: {
  message: string;
  checkpageref: Function;
  citations: number[];
}) {
  return (
    <div className="flex flex-col gap-1 max-w-3/4">
      <div className="rounded-4xl px-2 py-1 max-w-3/4">{message}</div>
      <div className="flex gap-2">
        {citations.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => checkpageref(pageNumber)}
            className="px-2 py-1 rounded-2xl bg-violet-500 text-white hover:bg-violet-700"
          >
            Page {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AIChat;
