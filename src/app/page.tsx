"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import InputForm from "./components/InputForm";
import ResponseDisplay from "./components/ResponseDisplay";
import Footer from "./components/Footer";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for user's preferred color scheme
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSubmit = async (input: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error motivating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto px-4 flex flex-col min-h-screen">
        <Header isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
        <main className="flex-grow flex flex-col items-center justify-start py-8">
          <Hero />
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          <ResponseDisplay response={response} />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
