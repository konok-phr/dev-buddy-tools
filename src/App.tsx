import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JsonFormatter from "./pages/tools/JsonFormatter";
import Base64Tool from "./pages/tools/Base64Tool";
import RegexTester from "./pages/tools/RegexTester";
import ApiTester from "./pages/tools/ApiTester";
import TimestampConverter from "./pages/tools/TimestampConverter";
import UuidGenerator from "./pages/tools/UuidGenerator";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import ColorPicker from "./pages/tools/ColorPicker";
import HashGenerator from "./pages/tools/HashGenerator";
import MarkdownPreview from "./pages/tools/MarkdownPreview";
import LoremIpsum from "./pages/tools/LoremIpsum";
import LogViewer from "./pages/tools/LogViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/base64" element={<Base64Tool />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/api-tester" element={<ApiTester />} />
            <Route path="/tools/timestamp" element={<TimestampConverter />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/markdown-preview" element={<MarkdownPreview />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="/tools/log-viewer" element={<LogViewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
