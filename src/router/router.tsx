import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "@/pages/index";

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterApp />);