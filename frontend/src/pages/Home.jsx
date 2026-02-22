import { useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import ExampleSection from "../components/ExampleSection";

export default function Home() {

  useEffect(() => {
    const bg = document.querySelector(".home-security-bg");
    if (!bg) return;

    const symbols = ["🔐", "🛡️", "🔎", "⚡", "💻"];
    const colors = ["red", "blue", "green", "white"];

    function createFloatingItem() {
      const span = document.createElement("span");
      span.innerText = symbols[Math.floor(Math.random() * symbols.length)];

      span.classList.add(colors[Math.floor(Math.random() * colors.length)]);

      span.style.left = Math.random() * 100 + "vw";
      span.style.fontSize = 16 + Math.random() * 30 + "px";
      span.style.animationDuration = 10 + Math.random() * 15 + "s";

      bg.appendChild(span);

      setTimeout(() => {
        span.remove();
      }, 20000);
    }

    const interval = setInterval(createFloatingItem, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Background Generator */}
      <div className="home-security-bg"></div>

      <Hero />
      <Features />
      <HowItWorks />
      <ExampleSection />
    </>
  );
}