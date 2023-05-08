import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./main/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/piano" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
