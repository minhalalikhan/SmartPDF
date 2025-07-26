import Homepage from "@/pages/Homepage";
import "./App.css";
import { Routes, Route } from "react-router";
import PdfAgentpage from "@/pages/PdfAgentpage";
import PageNotFound from "@/pages/PageNotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/pdf-agent" element={<PdfAgentpage />} />
      <Route path="*" element={<PageNotFound />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
