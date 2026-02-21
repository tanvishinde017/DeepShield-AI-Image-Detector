import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExampleSection from "./components/ExampleSection";
import Home from "./pages/Home";
import AnalyzeImage from "./pages/AnalyzeImage";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import HowItWorks from "./components/HowItWorks";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze-image" element={<AnalyzeImage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/examples" element={<ExampleSection />} />
      </Routes>
    </>
  );
}

export default App;