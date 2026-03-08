import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ThemeProvider, FavoritesProvider, RecentsProvider } from "@/hooks/use-preferences";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all tool pages for code splitting & fast initial load
const JsonFormatter = lazy(() => import("./pages/tools/JsonFormatter"));
const Base64Tool = lazy(() => import("./pages/tools/Base64Tool"));
const RegexTester = lazy(() => import("./pages/tools/RegexTester"));
const ApiTester = lazy(() => import("./pages/tools/ApiTester"));
const TimestampConverter = lazy(() => import("./pages/tools/TimestampConverter"));
const UuidGenerator = lazy(() => import("./pages/tools/UuidGenerator"));
const PasswordGenerator = lazy(() => import("./pages/tools/PasswordGenerator"));
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator"));
const MarkdownPreview = lazy(() => import("./pages/tools/MarkdownPreview"));
const LoremIpsum = lazy(() => import("./pages/tools/LoremIpsum"));
const LogViewer = lazy(() => import("./pages/tools/LogViewer"));
const JwtDecoder = lazy(() => import("./pages/tools/JwtDecoder"));
const UrlEncoder = lazy(() => import("./pages/tools/UrlEncoder"));
const DiffChecker = lazy(() => import("./pages/tools/DiffChecker"));
const CssMinifier = lazy(() => import("./pages/tools/CssMinifier"));
const HtmlEntityEncoder = lazy(() => import("./pages/tools/HtmlEntityEncoder"));
const JsonToCsv = lazy(() => import("./pages/tools/JsonToCsv"));
const CronParser = lazy(() => import("./pages/tools/CronParser"));
const RegexCheatsheet = lazy(() => import("./pages/tools/RegexCheatsheet"));
const SvgOptimizer = lazy(() => import("./pages/tools/SvgOptimizer"));
const PdfMerger = lazy(() => import("./pages/tools/PdfMerger"));
const PdfPageExtractor = lazy(() => import("./pages/tools/PdfPageExtractor"));
const PdfMetadata = lazy(() => import("./pages/tools/PdfMetadata"));
const NumberBaseConverter = lazy(() => import("./pages/tools/NumberBaseConverter"));
const YamlToJson = lazy(() => import("./pages/tools/YamlToJson"));
const JsonSchemaValidator = lazy(() => import("./pages/tools/JsonSchemaValidator"));
const TextCaseConverter = lazy(() => import("./pages/tools/TextCaseConverter"));
const IpAddressAnalyzer = lazy(() => import("./pages/tools/IpAddressAnalyzer"));
const UnixPermissionsCalculator = lazy(() => import("./pages/tools/UnixPermissionsCalculator"));
const HttpStatusCodeReference = lazy(() => import("./pages/tools/HttpStatusCodeReference"));
const MarkdownTableGenerator = lazy(() => import("./pages/tools/MarkdownTableGenerator"));
const ColorPaletteGenerator = lazy(() => import("./pages/tools/ColorPaletteGenerator"));
const BoxShadowGenerator = lazy(() => import("./pages/tools/BoxShadowGenerator"));
const FlexboxPlayground = lazy(() => import("./pages/tools/FlexboxPlayground"));
const CssGridGenerator = lazy(() => import("./pages/tools/CssGridGenerator"));
const GradientGenerator = lazy(() => import("./pages/tools/GradientGenerator"));
const BorderRadiusGenerator = lazy(() => import("./pages/tools/BorderRadiusGenerator"));
const TextShadowGenerator = lazy(() => import("./pages/tools/TextShadowGenerator"));
const AspectRatioCalculator = lazy(() => import("./pages/tools/AspectRatioCalculator"));
const Base64ImageEncoder = lazy(() => import("./pages/tools/Base64ImageEncoder"));
const FaviconGenerator = lazy(() => import("./pages/tools/FaviconGenerator"));
const MetaTagGenerator = lazy(() => import("./pages/tools/MetaTagGenerator"));
const OpenGraphPreview = lazy(() => import("./pages/tools/OpenGraphPreview"));
const QrCodeGenerator = lazy(() => import("./pages/tools/QrCodeGenerator"));
const CharacterCounter = lazy(() => import("./pages/tools/CharacterCounter"));
const JsonPathFinder = lazy(() => import("./pages/tools/JsonPathFinder"));
const CssUnitConverter = lazy(() => import("./pages/tools/CssUnitConverter"));
const EncodingConverter = lazy(() => import("./pages/tools/EncodingConverter"));
const SqlFormatter = lazy(() => import("./pages/tools/SqlFormatter"));
const TailwindConverter = lazy(() => import("./pages/tools/TailwindConverter"));
const RegexGenerator = lazy(() => import("./pages/tools/RegexGenerator"));
const JsonDiffViewer = lazy(() => import("./pages/tools/JsonDiffViewer"));
const CssAnimationGenerator = lazy(() => import("./pages/tools/CssAnimationGenerator"));
const GitCommandBuilder = lazy(() => import("./pages/tools/GitCommandBuilder"));
const TypeScriptTypeGenerator = lazy(() => import("./pages/tools/TypeScriptTypeGenerator"));
const ColorContrastChecker = lazy(() => import("./pages/tools/ColorContrastChecker"));
const EmojiPicker = lazy(() => import("./pages/tools/EmojiPicker"));
const PlaceholderImageGenerator = lazy(() => import("./pages/tools/PlaceholderImageGenerator"));
const StringEscaper = lazy(() => import("./pages/tools/StringEscaper"));
const CssClipPathGenerator = lazy(() => import("./pages/tools/CssClipPathGenerator"));
const HtmlPreview = lazy(() => import("./pages/tools/HtmlPreview"));
const XmlFormatter = lazy(() => import("./pages/tools/XmlFormatter"));
const TomlJsonConverter = lazy(() => import("./pages/tools/TomlJsonConverter"));
const EpochBatchConverter = lazy(() => import("./pages/tools/EpochBatchConverter"));
const ByteSizeCalculator = lazy(() => import("./pages/tools/ByteSizeCalculator"));
const SlugGenerator = lazy(() => import("./pages/tools/SlugGenerator"));
const RobotsTxtGenerator = lazy(() => import("./pages/tools/RobotsTxtGenerator"));
const SitemapGeneratorPage = lazy(() => import("./pages/tools/SitemapGeneratorPage"));
const MarkdownToHtml = lazy(() => import("./pages/tools/MarkdownToHtml"));
const ImageCompressor = lazy(() => import("./pages/tools/ImageCompressor"));
const ColorBlindnessSimulator = lazy(() => import("./pages/tools/ColorBlindnessSimulator"));
const CssSpecificityCalculator = lazy(() => import("./pages/tools/CssSpecificityCalculator"));
const CodeScreenshot = lazy(() => import("./pages/tools/CodeScreenshot"));
const HtaccessGenerator = lazy(() => import("./pages/tools/HtaccessGenerator"));
const ResponsiveBreakpointTester = lazy(() => import("./pages/tools/ResponsiveBreakpointTester"));
const CsvViewer = lazy(() => import("./pages/tools/CsvViewer"));
const HtmlCssJsMinifier = lazy(() => import("./pages/tools/HtmlCssJsMinifier"));
const CodeBeautifier = lazy(() => import("./pages/tools/CodeBeautifier"));
const WebpackConfigGenerator = lazy(() => import("./pages/tools/WebpackConfigGenerator"));
const EnvFileEditor = lazy(() => import("./pages/tools/EnvFileEditor"));
const CorsHeaderChecker = lazy(() => import("./pages/tools/CorsHeaderChecker"));
const CspGenerator = lazy(() => import("./pages/tools/CspGenerator"));
const TotpGenerator = lazy(() => import("./pages/tools/TotpGenerator"));
const WebhookTester = lazy(() => import("./pages/tools/WebhookTester"));
const DnsLookup = lazy(() => import("./pages/tools/DnsLookup"));
const SslDecoder = lazy(() => import("./pages/tools/SslDecoder"));
const NpmPackageSize = lazy(() => import("./pages/tools/NpmPackageSize"));
const JsBenchmark = lazy(() => import("./pages/tools/JsBenchmark"));
const CronBuilder = lazy(() => import("./pages/tools/CronBuilder"));
const SshKeyGenerator = lazy(() => import("./pages/tools/SshKeyGenerator"));
const DockerComposeGenerator = lazy(() => import("./pages/tools/DockerComposeGenerator"));
const RegexDebugger = lazy(() => import("./pages/tools/RegexDebugger"));
const GitignoreGenerator = lazy(() => import("./pages/tools/GitignoreGenerator"));
const AsciiTableGenerator = lazy(() => import("./pages/tools/AsciiTableGenerator"));
const HttpHeaderInspector = lazy(() => import("./pages/tools/HttpHeaderInspector"));
const TsToJson = lazy(() => import("./pages/tools/TsToJson"));
const DnsPropagation = lazy(() => import("./pages/tools/DnsPropagation"));
const ImageMetadata = lazy(() => import("./pages/tools/ImageMetadata"));
const ImageResizer = lazy(() => import("./pages/tools/ImageResizer"));
const ImageColorExtractor = lazy(() => import("./pages/tools/ImageColorExtractor"));
const ImageToAscii = lazy(() => import("./pages/tools/ImageToAscii"));
const ImageFormatConverter = lazy(() => import("./pages/tools/ImageFormatConverter"));
const ImageFilters = lazy(() => import("./pages/tools/ImageFilters"));
const ImageCropper = lazy(() => import("./pages/tools/ImageCropper"));
const GraphqlPlayground = lazy(() => import("./pages/tools/GraphqlPlayground"));
const OpenApiViewer = lazy(() => import("./pages/tools/OpenApiViewer"));
const JsonToZod = lazy(() => import("./pages/tools/JsonToZod"));
const PackageJsonGenerator = lazy(() => import("./pages/tools/PackageJsonGenerator"));
const GlassmorphismGenerator = lazy(() => import("./pages/tools/GlassmorphismGenerator"));
const NeumorphismGenerator = lazy(() => import("./pages/tools/NeumorphismGenerator"));
const CssTransitionBuilder = lazy(() => import("./pages/tools/CssTransitionBuilder"));
const SvgPathEditor = lazy(() => import("./pages/tools/SvgPathEditor"));
const NginxConfigGenerator = lazy(() => import("./pages/tools/NginxConfigGenerator"));
const GithubActionsBuilder = lazy(() => import("./pages/tools/GithubActionsBuilder"));
const FakeDataGenerator = lazy(() => import("./pages/tools/FakeDataGenerator"));
const PdfViewer = lazy(() => import("./pages/tools/PdfViewer"));
const MarkdownSlidePresenter = lazy(() => import("./pages/tools/MarkdownSlidePresenter"));
const SqlPlayground = lazy(() => import("./pages/tools/SqlPlayground"));
const MongoQueryBuilder = lazy(() => import("./pages/tools/MongoQueryBuilder"));
const WebSocketTester = lazy(() => import("./pages/tools/WebSocketTester"));

const queryClient = new QueryClient();

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-fade-in">
      <div className="relative">
        <div className="h-12 w-12 rounded-xl border-2 border-primary/20 animate-pulse" />
        <div className="absolute inset-0 h-12 w-12 rounded-xl border-2 border-transparent border-t-primary animate-spin" />
      </div>
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
      </div>
      <p className="text-sm text-muted-foreground font-medium">Loading tool...</p>
    </div>
  );
}

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
                <Suspense fallback={<LoadingFallback />}>
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
                    <Route path="/tools/pdf-viewer" element={<PdfViewer />} />
                    <Route path="/tools/md-slides" element={<MarkdownSlidePresenter />} />
                    <Route path="/tools/sql-playground" element={<SqlPlayground />} />
                    <Route path="/tools/mongo-query" element={<MongoQueryBuilder />} />
                    <Route path="/tools/websocket-tester" element={<WebSocketTester />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </RecentsProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
