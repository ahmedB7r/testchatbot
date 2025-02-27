import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ChatProvider } from "./contexts/ChatContext";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ChatView from "./components/ChatView";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LoadingProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="chat/:chatId" element={<ChatView />} />
              </Route>
            </Routes>
          </ChatProvider>
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
