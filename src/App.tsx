import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ThemeProvider, FavoritesProvider, RecentsProvider } from "@/hooks/use-preferences";
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
import JwtDecoder from "./pages/tools/JwtDecoder";
import UrlEncoder from "./pages/tools/UrlEncoder";
import DiffChecker from "./pages/tools/DiffChecker";
import CssMinifier from "./pages/tools/CssMinifier";
import HtmlEntityEncoder from "./pages/tools/HtmlEntityEncoder";
import JsonToCsv from "./pages/tools/JsonToCsv";
import CronParser from "./pages/tools/CronParser";
import RegexCheatsheet from "./pages/tools/RegexCheatsheet";
import SvgOptimizer from "./pages/tools/SvgOptimizer";
import PdfMerger from "./pages/tools/PdfMerger";
import PdfPageExtractor from "./pages/tools/PdfPageExtractor";
import PdfMetadata from "./pages/tools/PdfMetadata";
import NumberBaseConverter from "./pages/tools/NumberBaseConverter";
import YamlToJson from "./pages/tools/YamlToJson";
import JsonSchemaValidator from "./pages/tools/JsonSchemaValidator";
import TextCaseConverter from "./pages/tools/TextCaseConverter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <FavoritesProvider>
        <RecentsProvider>
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
                  <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
                  <Route path="/tools/url-encoder" element={<UrlEncoder />} />
                  <Route path="/tools/diff-checker" element={<DiffChecker />} />
                  <Route path="/tools/css-minifier" element={<CssMinifier />} />
                  <Route path="/tools/html-entity" element={<HtmlEntityEncoder />} />
                  <Route path="/tools/json-csv" element={<JsonToCsv />} />
                  <Route path="/tools/cron-parser" element={<CronParser />} />
                  <Route path="/tools/regex-cheatsheet" element={<RegexCheatsheet />} />
                  <Route path="/tools/svg-optimizer" element={<SvgOptimizer />} />
                  <Route path="/tools/pdf-merger" element={<PdfMerger />} />
                  <Route path="/tools/pdf-extractor" element={<PdfPageExtractor />} />
                  <Route path="/tools/pdf-metadata" element={<PdfMetadata />} />
                  <Route path="/tools/number-base" element={<NumberBaseConverter />} />
                  <Route path="/tools/yaml-json" element={<YamlToJson />} />
                  <Route path="/tools/json-schema" element={<JsonSchemaValidator />} />
                  <Route path="/tools/text-case" element={<TextCaseConverter />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </RecentsProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
