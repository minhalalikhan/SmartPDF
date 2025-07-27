import Homepage from "@/pages/Homepage";
import "./App.css";
import { Routes, Route } from "react-router";
import { v4 as uuidv4 } from "uuid";
import PdfAgentpage from "@/pages/PdfAgentpage";
import PageNotFound from "@/pages/PageNotFound";
import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";

function App() {
  const { setUser, removeUser } = useUserStore();

  useEffect(() => {
    const userID: string = uuidv4();
    setUser(userID);

    return () => {
      removeUser();
    };
  }, []);

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
