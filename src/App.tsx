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
import IpAddressAnalyzer from "./pages/tools/IpAddressAnalyzer";
import UnixPermissionsCalculator from "./pages/tools/UnixPermissionsCalculator";
import HttpStatusCodeReference from "./pages/tools/HttpStatusCodeReference";
import MarkdownTableGenerator from "./pages/tools/MarkdownTableGenerator";
import ColorPaletteGenerator from "./pages/tools/ColorPaletteGenerator";
import BoxShadowGenerator from "./pages/tools/BoxShadowGenerator";
import FlexboxPlayground from "./pages/tools/FlexboxPlayground";
import CssGridGenerator from "./pages/tools/CssGridGenerator";
import GradientGenerator from "./pages/tools/GradientGenerator";
import BorderRadiusGenerator from "./pages/tools/BorderRadiusGenerator";
import TextShadowGenerator from "./pages/tools/TextShadowGenerator";
import AspectRatioCalculator from "./pages/tools/AspectRatioCalculator";
import Base64ImageEncoder from "./pages/tools/Base64ImageEncoder";
import FaviconGenerator from "./pages/tools/FaviconGenerator";
import MetaTagGenerator from "./pages/tools/MetaTagGenerator";
import OpenGraphPreview from "./pages/tools/OpenGraphPreview";
import QrCodeGenerator from "./pages/tools/QrCodeGenerator";
import CharacterCounter from "./pages/tools/CharacterCounter";
import JsonPathFinder from "./pages/tools/JsonPathFinder";
import CssUnitConverter from "./pages/tools/CssUnitConverter";
import EncodingConverter from "./pages/tools/EncodingConverter";
import SqlFormatter from "./pages/tools/SqlFormatter";
import TailwindConverter from "./pages/tools/TailwindConverter";
import RegexGenerator from "./pages/tools/RegexGenerator";
import JsonDiffViewer from "./pages/tools/JsonDiffViewer";
import CssAnimationGenerator from "./pages/tools/CssAnimationGenerator";
import GitCommandBuilder from "./pages/tools/GitCommandBuilder";
import TypeScriptTypeGenerator from "./pages/tools/TypeScriptTypeGenerator";
import ColorContrastChecker from "./pages/tools/ColorContrastChecker";
import EmojiPicker from "./pages/tools/EmojiPicker";
import PlaceholderImageGenerator from "./pages/tools/PlaceholderImageGenerator";
import StringEscaper from "./pages/tools/StringEscaper";
import CssClipPathGenerator from "./pages/tools/CssClipPathGenerator";
import HtmlPreview from "./pages/tools/HtmlPreview";
import XmlFormatter from "./pages/tools/XmlFormatter";
import TomlJsonConverter from "./pages/tools/TomlJsonConverter";
import EpochBatchConverter from "./pages/tools/EpochBatchConverter";
import ByteSizeCalculator from "./pages/tools/ByteSizeCalculator";
import SlugGenerator from "./pages/tools/SlugGenerator";
import RobotsTxtGenerator from "./pages/tools/RobotsTxtGenerator";
import SitemapGeneratorPage from "./pages/tools/SitemapGeneratorPage";
import MarkdownToHtml from "./pages/tools/MarkdownToHtml";
import ImageCompressor from "./pages/tools/ImageCompressor";
import ColorBlindnessSimulator from "./pages/tools/ColorBlindnessSimulator";
import CssSpecificityCalculator from "./pages/tools/CssSpecificityCalculator";
import CodeScreenshot from "./pages/tools/CodeScreenshot";
import HtaccessGenerator from "./pages/tools/HtaccessGenerator";
import ResponsiveBreakpointTester from "./pages/tools/ResponsiveBreakpointTester";
import CsvViewer from "./pages/tools/CsvViewer";
import HtmlCssJsMinifier from "./pages/tools/HtmlCssJsMinifier";
import CodeBeautifier from "./pages/tools/CodeBeautifier";
import WebpackConfigGenerator from "./pages/tools/WebpackConfigGenerator";
import EnvFileEditor from "./pages/tools/EnvFileEditor";
import CorsHeaderChecker from "./pages/tools/CorsHeaderChecker";
import CspGenerator from "./pages/tools/CspGenerator";
import TotpGenerator from "./pages/tools/TotpGenerator";
import WebhookTester from "./pages/tools/WebhookTester";
import DnsLookup from "./pages/tools/DnsLookup";
import SslDecoder from "./pages/tools/SslDecoder";
import NpmPackageSize from "./pages/tools/NpmPackageSize";
import JsBenchmark from "./pages/tools/JsBenchmark";
import CronBuilder from "./pages/tools/CronBuilder";
import SshKeyGenerator from "./pages/tools/SshKeyGenerator";
import DockerComposeGenerator from "./pages/tools/DockerComposeGenerator";
import RegexDebugger from "./pages/tools/RegexDebugger";
import GitignoreGenerator from "./pages/tools/GitignoreGenerator";
import AsciiTableGenerator from "./pages/tools/AsciiTableGenerator";
import HttpHeaderInspector from "./pages/tools/HttpHeaderInspector";
import TsToJson from "./pages/tools/TsToJson";
import DnsPropagation from "./pages/tools/DnsPropagation";
import ImageMetadata from "./pages/tools/ImageMetadata";
import ImageResizer from "./pages/tools/ImageResizer";
import ImageColorExtractor from "./pages/tools/ImageColorExtractor";
import ImageToAscii from "./pages/tools/ImageToAscii";
import ImageFormatConverter from "./pages/tools/ImageFormatConverter";
import ImageFilters from "./pages/tools/ImageFilters";
import ImageCropper from "./pages/tools/ImageCropper";
import GraphqlPlayground from "./pages/tools/GraphqlPlayground";
import OpenApiViewer from "./pages/tools/OpenApiViewer";
import JsonToZod from "./pages/tools/JsonToZod";
import PackageJsonGenerator from "./pages/tools/PackageJsonGenerator";
import GlassmorphismGenerator from "./pages/tools/GlassmorphismGenerator";
import NeumorphismGenerator from "./pages/tools/NeumorphismGenerator";
import CssTransitionBuilder from "./pages/tools/CssTransitionBuilder";
import SvgPathEditor from "./pages/tools/SvgPathEditor";
import NginxConfigGenerator from "./pages/tools/NginxConfigGenerator";
import GithubActionsBuilder from "./pages/tools/GithubActionsBuilder";
import FakeDataGenerator from "./pages/tools/FakeDataGenerator";
import PdfViewer from "./pages/tools/PdfViewer";
import MarkdownSlidePresenter from "./pages/tools/MarkdownSlidePresenter";

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
                  <Route path="/tools/ip-analyzer" element={<IpAddressAnalyzer />} />
                  <Route path="/tools/unix-permissions" element={<UnixPermissionsCalculator />} />
                  <Route path="/tools/http-status" element={<HttpStatusCodeReference />} />
                  <Route path="/tools/markdown-table" element={<MarkdownTableGenerator />} />
                  <Route path="/tools/color-palette" element={<ColorPaletteGenerator />} />
                  <Route path="/tools/box-shadow" element={<BoxShadowGenerator />} />
                  <Route path="/tools/flexbox" element={<FlexboxPlayground />} />
                  <Route path="/tools/css-grid" element={<CssGridGenerator />} />
                  <Route path="/tools/gradient" element={<GradientGenerator />} />
                  <Route path="/tools/border-radius" element={<BorderRadiusGenerator />} />
                  <Route path="/tools/text-shadow" element={<TextShadowGenerator />} />
                  <Route path="/tools/aspect-ratio" element={<AspectRatioCalculator />} />
                  <Route path="/tools/base64-image" element={<Base64ImageEncoder />} />
                  <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
                  <Route path="/tools/meta-tag" element={<MetaTagGenerator />} />
                  <Route path="/tools/og-preview" element={<OpenGraphPreview />} />
                  <Route path="/tools/qr-code" element={<QrCodeGenerator />} />
                  <Route path="/tools/char-counter" element={<CharacterCounter />} />
                  <Route path="/tools/json-path" element={<JsonPathFinder />} />
                  <Route path="/tools/css-unit" element={<CssUnitConverter />} />
                  <Route path="/tools/encoding" element={<EncodingConverter />} />
                  <Route path="/tools/sql-formatter" element={<SqlFormatter />} />
                  <Route path="/tools/tailwind" element={<TailwindConverter />} />
                  <Route path="/tools/regex-generator" element={<RegexGenerator />} />
                  <Route path="/tools/json-diff" element={<JsonDiffViewer />} />
                  <Route path="/tools/css-animation" element={<CssAnimationGenerator />} />
                  <Route path="/tools/git-command" element={<GitCommandBuilder />} />
                  <Route path="/tools/ts-type" element={<TypeScriptTypeGenerator />} />
                  <Route path="/tools/color-contrast" element={<ColorContrastChecker />} />
                  <Route path="/tools/emoji-picker" element={<EmojiPicker />} />
                  <Route path="/tools/placeholder-image" element={<PlaceholderImageGenerator />} />
                  <Route path="/tools/string-escaper" element={<StringEscaper />} />
                  <Route path="/tools/clip-path" element={<CssClipPathGenerator />} />
                  <Route path="/tools/html-preview" element={<HtmlPreview />} />
                  <Route path="/tools/xml-formatter" element={<XmlFormatter />} />
                  <Route path="/tools/toml-json" element={<TomlJsonConverter />} />
                  <Route path="/tools/epoch-batch" element={<EpochBatchConverter />} />
                  <Route path="/tools/byte-size" element={<ByteSizeCalculator />} />
                  <Route path="/tools/slug-generator" element={<SlugGenerator />} />
                  <Route path="/tools/robots-txt" element={<RobotsTxtGenerator />} />
                  <Route path="/tools/sitemap-generator" element={<SitemapGeneratorPage />} />
                  <Route path="/tools/md-to-html" element={<MarkdownToHtml />} />
                  <Route path="/tools/image-compressor" element={<ImageCompressor />} />
                  <Route path="/tools/color-blindness" element={<ColorBlindnessSimulator />} />
                  <Route path="/tools/css-specificity" element={<CssSpecificityCalculator />} />
                  <Route path="/tools/code-screenshot" element={<CodeScreenshot />} />
                  <Route path="/tools/htaccess" element={<HtaccessGenerator />} />
                  <Route path="/tools/responsive-tester" element={<ResponsiveBreakpointTester />} />
                  <Route path="/tools/csv-viewer" element={<CsvViewer />} />
                  <Route path="/tools/html-css-js-minifier" element={<HtmlCssJsMinifier />} />
                  <Route path="/tools/code-beautifier" element={<CodeBeautifier />} />
                  <Route path="/tools/webpack-config" element={<WebpackConfigGenerator />} />
                  <Route path="/tools/env-editor" element={<EnvFileEditor />} />
                  <Route path="/tools/cors-checker" element={<CorsHeaderChecker />} />
                  <Route path="/tools/csp-generator" element={<CspGenerator />} />
                  <Route path="/tools/totp-generator" element={<TotpGenerator />} />
                  <Route path="/tools/webhook-tester" element={<WebhookTester />} />
                  <Route path="/tools/dns-lookup" element={<DnsLookup />} />
                  <Route path="/tools/ssl-decoder" element={<SslDecoder />} />
                  <Route path="/tools/npm-size" element={<NpmPackageSize />} />
                  <Route path="/tools/js-benchmark" element={<JsBenchmark />} />
                  <Route path="/tools/cron-builder" element={<CronBuilder />} />
                  <Route path="/tools/ssh-keygen" element={<SshKeyGenerator />} />
                  <Route path="/tools/docker-compose" element={<DockerComposeGenerator />} />
                  <Route path="/tools/regex-debugger" element={<RegexDebugger />} />
                  <Route path="/tools/gitignore" element={<GitignoreGenerator />} />
                  <Route path="/tools/ascii-table" element={<AsciiTableGenerator />} />
                  <Route path="/tools/http-headers" element={<HttpHeaderInspector />} />
                  <Route path="/tools/ts-to-json" element={<TsToJson />} />
                  <Route path="/tools/dns-propagation" element={<DnsPropagation />} />
                  <Route path="/tools/image-metadata" element={<ImageMetadata />} />
                  <Route path="/tools/image-resizer" element={<ImageResizer />} />
                  <Route path="/tools/image-colors" element={<ImageColorExtractor />} />
                  <Route path="/tools/image-ascii" element={<ImageToAscii />} />
                  <Route path="/tools/image-convert" element={<ImageFormatConverter />} />
                  <Route path="/tools/image-filters" element={<ImageFilters />} />
                  <Route path="/tools/image-cropper" element={<ImageCropper />} />
                  <Route path="/tools/graphql-playground" element={<GraphqlPlayground />} />
                  <Route path="/tools/openapi-viewer" element={<OpenApiViewer />} />
                  <Route path="/tools/json-to-zod" element={<JsonToZod />} />
                  <Route path="/tools/package-json" element={<PackageJsonGenerator />} />
                  <Route path="/tools/glassmorphism" element={<GlassmorphismGenerator />} />
                  <Route path="/tools/neumorphism" element={<NeumorphismGenerator />} />
                  <Route path="/tools/css-transition" element={<CssTransitionBuilder />} />
                  <Route path="/tools/svg-path-editor" element={<SvgPathEditor />} />
                  <Route path="/tools/nginx-config" element={<NginxConfigGenerator />} />
                  <Route path="/tools/github-actions" element={<GithubActionsBuilder />} />
                  <Route path="/tools/fake-data" element={<FakeDataGenerator />} />
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
