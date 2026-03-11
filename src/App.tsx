import { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ThemeProvider, FavoritesProvider, RecentsProvider, StatsProvider } from "@/hooks/use-preferences";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all tool pages
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
const DomainChecker = lazy(() => import("./pages/tools/DomainChecker"));
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
const CurlToCode = lazy(() => import("./pages/tools/CurlToCode"));
const HtmlToJsx = lazy(() => import("./pages/tools/HtmlToJsx"));
const JsonToGoStruct = lazy(() => import("./pages/tools/JsonToGoStruct"));
const HtmlToMarkdown = lazy(() => import("./pages/tools/HtmlToMarkdown"));
const JsonToPython = lazy(() => import("./pages/tools/JsonToPython"));
const PasswordStrengthChecker = lazy(() => import("./pages/tools/PasswordStrengthChecker"));
const AesEncryption = lazy(() => import("./pages/tools/AesEncryption"));
const CipherTools = lazy(() => import("./pages/tools/CipherTools"));
const UnitConverter = lazy(() => import("./pages/tools/UnitConverter"));
const PercentageCalculator = lazy(() => import("./pages/tools/PercentageCalculator"));
const DateCalculator = lazy(() => import("./pages/tools/DateCalculator"));
const SubnetCalculator = lazy(() => import("./pages/tools/SubnetCalculator"));
const TimezoneConverter = lazy(() => import("./pages/tools/TimezoneConverter"));
const RemoveDuplicateLines = lazy(() => import("./pages/tools/RemoveDuplicateLines"));
const SortLines = lazy(() => import("./pages/tools/SortLines"));
const WordFrequencyCounter = lazy(() => import("./pages/tools/WordFrequencyCounter"));
const TextReverser = lazy(() => import("./pages/tools/TextReverser"));
const AddLineNumbers = lazy(() => import("./pages/tools/AddLineNumbers"));
// New batch
const JsonToXml = lazy(() => import("./pages/tools/JsonToXml"));
const JsonToRust = lazy(() => import("./pages/tools/JsonToRust"));
const JsonToKotlin = lazy(() => import("./pages/tools/JsonToKotlin"));
const JsonToSwift = lazy(() => import("./pages/tools/JsonToSwift"));
const JsonFlattener = lazy(() => import("./pages/tools/JsonFlattener"));
const TextStatistics = lazy(() => import("./pages/tools/TextStatistics"));
const MarkdownToc = lazy(() => import("./pages/tools/MarkdownToc"));
const TextFindReplace = lazy(() => import("./pages/tools/TextFindReplace"));
const LoremJson = lazy(() => import("./pages/tools/LoremJson"));
const TextWrapper = lazy(() => import("./pages/tools/TextWrapper"));
const ReadmeGenerator = lazy(() => import("./pages/tools/ReadmeGenerator"));
const EslintConfigGenerator = lazy(() => import("./pages/tools/EslintConfigGenerator"));
const TsconfigGenerator = lazy(() => import("./pages/tools/TsconfigGenerator"));
const HmacGenerator = lazy(() => import("./pages/tools/HmacGenerator"));
const SriHashGenerator = lazy(() => import("./pages/tools/SriHashGenerator"));
const Base32Encoder = lazy(() => import("./pages/tools/Base32Encoder"));
const AgeCalculator = lazy(() => import("./pages/tools/AgeCalculator"));
const BmiCalculator = lazy(() => import("./pages/tools/BmiCalculator"));
const LoanCalculator = lazy(() => import("./pages/tools/LoanCalculator"));
const TipCalculator = lazy(() => import("./pages/tools/TipCalculator"));
const DiscountCalculator = lazy(() => import("./pages/tools/DiscountCalculator"));
const ScientificCalculator = lazy(() => import("./pages/tools/ScientificCalculator"));
const UserAgentParser = lazy(() => import("./pages/tools/UserAgentParser"));
const PortReference = lazy(() => import("./pages/tools/PortReference"));
const UrlParser = lazy(() => import("./pages/tools/UrlParser"));
const HttpMethodReference = lazy(() => import("./pages/tools/HttpMethodReference"));
const ColorMixer = lazy(() => import("./pages/tools/ColorMixer"));
const FontPairGenerator = lazy(() => import("./pages/tools/FontPairGenerator"));
const CssFilterGenerator = lazy(() => import("./pages/tools/CssFilterGenerator"));
const CssColumnsGenerator = lazy(() => import("./pages/tools/CssColumnsGenerator"));
const StructuredDataGenerator = lazy(() => import("./pages/tools/StructuredDataGenerator"));
const LicenseGenerator = lazy(() => import("./pages/tools/LicenseGenerator"));
const ChangelogGenerator = lazy(() => import("./pages/tools/ChangelogGenerator"));
const EditorconfigGenerator = lazy(() => import("./pages/tools/EditorconfigGenerator"));
const PrettierConfigGenerator = lazy(() => import("./pages/tools/PrettierConfigGenerator"));
const ImageWatermark = lazy(() => import("./pages/tools/ImageWatermark"));
const ImagePixelate = lazy(() => import("./pages/tools/ImagePixelate"));
const ImageFlipRotate = lazy(() => import("./pages/tools/ImageFlipRotate"));
const CmsChecker = lazy(() => import("./pages/tools/CmsChecker"));

const queryClient = new QueryClient();

function DelayedFallback() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 250);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
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
          <StatsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Layout>
                  <Suspense fallback={<DelayedFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* Text & Data */}
                    <Route path="/tools/json-formatter" element={<JsonFormatter />} />
                    <Route path="/tools/base64" element={<Base64Tool />} />
                    <Route path="/tools/markdown-preview" element={<MarkdownPreview />} />
                    <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
                    <Route path="/tools/log-viewer" element={<LogViewer />} />
                    <Route path="/tools/diff-checker" element={<DiffChecker />} />
                    <Route path="/tools/json-csv" element={<JsonToCsv />} />
                    <Route path="/tools/yaml-json" element={<YamlToJson />} />
                    <Route path="/tools/text-case" element={<TextCaseConverter />} />
                    <Route path="/tools/markdown-table" element={<MarkdownTableGenerator />} />
                    <Route path="/tools/char-counter" element={<CharacterCounter />} />
                    <Route path="/tools/json-path" element={<JsonPathFinder />} />
                    <Route path="/tools/string-escaper" element={<StringEscaper />} />
                    <Route path="/tools/xml-formatter" element={<XmlFormatter />} />
                    <Route path="/tools/toml-json" element={<TomlJsonConverter />} />
                    <Route path="/tools/slug-generator" element={<SlugGenerator />} />
                    <Route path="/tools/md-to-html" element={<MarkdownToHtml />} />
                    <Route path="/tools/json-diff" element={<JsonDiffViewer />} />
                    <Route path="/tools/csv-viewer" element={<CsvViewer />} />
                    <Route path="/tools/ascii-table" element={<AsciiTableGenerator />} />
                    <Route path="/tools/pdf-viewer" element={<PdfViewer />} />
                    <Route path="/tools/md-slides" element={<MarkdownSlidePresenter />} />
                    <Route path="/tools/remove-duplicates" element={<RemoveDuplicateLines />} />
                    <Route path="/tools/sort-lines" element={<SortLines />} />
                    <Route path="/tools/word-frequency" element={<WordFrequencyCounter />} />
                    <Route path="/tools/text-reverser" element={<TextReverser />} />
                    <Route path="/tools/line-numbers" element={<AddLineNumbers />} />
                    <Route path="/tools/text-statistics" element={<TextStatistics />} />
                    <Route path="/tools/markdown-toc" element={<MarkdownToc />} />
                    <Route path="/tools/text-find-replace" element={<TextFindReplace />} />
                    <Route path="/tools/lorem-json" element={<LoremJson />} />
                    <Route path="/tools/text-wrapper" element={<TextWrapper />} />
                    <Route path="/tools/json-flattener" element={<JsonFlattener />} />
                    {/* Code & Testing */}
                    <Route path="/tools/regex-tester" element={<RegexTester />} />
                    <Route path="/tools/regex-cheatsheet" element={<RegexCheatsheet />} />
                    <Route path="/tools/api-tester" element={<ApiTester />} />
                    <Route path="/tools/css-minifier" element={<CssMinifier />} />
                    <Route path="/tools/html-entity" element={<HtmlEntityEncoder />} />
                    <Route path="/tools/cron-parser" element={<CronParser />} />
                    <Route path="/tools/svg-optimizer" element={<SvgOptimizer />} />
                    <Route path="/tools/json-schema" element={<JsonSchemaValidator />} />
                    <Route path="/tools/ip-analyzer" element={<IpAddressAnalyzer />} />
                    <Route path="/tools/unix-permissions" element={<UnixPermissionsCalculator />} />
                    <Route path="/tools/http-status" element={<HttpStatusCodeReference />} />
                    <Route path="/tools/sql-formatter" element={<SqlFormatter />} />
                    <Route path="/tools/regex-generator" element={<RegexGenerator />} />
                    <Route path="/tools/git-command" element={<GitCommandBuilder />} />
                    <Route path="/tools/ts-type" element={<TypeScriptTypeGenerator />} />
                    <Route path="/tools/html-preview" element={<HtmlPreview />} />
                    <Route path="/tools/meta-tag" element={<MetaTagGenerator />} />
                    <Route path="/tools/og-preview" element={<OpenGraphPreview />} />
                    <Route path="/tools/html-css-js-minifier" element={<HtmlCssJsMinifier />} />
                    <Route path="/tools/code-beautifier" element={<CodeBeautifier />} />
                    <Route path="/tools/webpack-config" element={<WebpackConfigGenerator />} />
                    <Route path="/tools/env-editor" element={<EnvFileEditor />} />
                    <Route path="/tools/npm-size" element={<NpmPackageSize />} />
                    <Route path="/tools/js-benchmark" element={<JsBenchmark />} />
                    <Route path="/tools/cron-builder" element={<CronBuilder />} />
                    <Route path="/tools/docker-compose" element={<DockerComposeGenerator />} />
                    <Route path="/tools/regex-debugger" element={<RegexDebugger />} />
                    <Route path="/tools/gitignore" element={<GitignoreGenerator />} />
                    <Route path="/tools/code-screenshot" element={<CodeScreenshot />} />
                    <Route path="/tools/htaccess" element={<HtaccessGenerator />} />
                    <Route path="/tools/responsive-tester" element={<ResponsiveBreakpointTester />} />
                    <Route path="/tools/graphql-playground" element={<GraphqlPlayground />} />
                    <Route path="/tools/openapi-viewer" element={<OpenApiViewer />} />
                    <Route path="/tools/json-to-zod" element={<JsonToZod />} />
                    <Route path="/tools/package-json" element={<PackageJsonGenerator />} />
                    <Route path="/tools/nginx-config" element={<NginxConfigGenerator />} />
                    <Route path="/tools/github-actions" element={<GithubActionsBuilder />} />
                    <Route path="/tools/sql-playground" element={<SqlPlayground />} />
                    <Route path="/tools/mongo-query" element={<MongoQueryBuilder />} />
                    <Route path="/tools/websocket-tester" element={<WebSocketTester />} />
                    <Route path="/tools/readme-generator" element={<ReadmeGenerator />} />
                    <Route path="/tools/eslint-config" element={<EslintConfigGenerator />} />
                    <Route path="/tools/tsconfig-gen" element={<TsconfigGenerator />} />
                    <Route path="/tools/editorconfig-gen" element={<EditorconfigGenerator />} />
                    <Route path="/tools/prettier-config" element={<PrettierConfigGenerator />} />
                    <Route path="/tools/license-gen" element={<LicenseGenerator />} />
                    <Route path="/tools/changelog-gen" element={<ChangelogGenerator />} />
                    {/* Converters */}
                    <Route path="/tools/timestamp" element={<TimestampConverter />} />
                    <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
                    <Route path="/tools/password-generator" element={<PasswordGenerator />} />
                    <Route path="/tools/color-picker" element={<ColorPicker />} />
                    <Route path="/tools/url-encoder" element={<UrlEncoder />} />
                    <Route path="/tools/number-base" element={<NumberBaseConverter />} />
                    <Route path="/tools/base64-image" element={<Base64ImageEncoder />} />
                    <Route path="/tools/qr-code" element={<QrCodeGenerator />} />
                    <Route path="/tools/encoding" element={<EncodingConverter />} />
                    <Route path="/tools/epoch-batch" element={<EpochBatchConverter />} />
                    <Route path="/tools/byte-size" element={<ByteSizeCalculator />} />
                    <Route path="/tools/image-compressor" element={<ImageCompressor />} />
                    <Route path="/tools/emoji-picker" element={<EmojiPicker />} />
                    <Route path="/tools/ts-to-json" element={<TsToJson />} />
                    <Route path="/tools/fake-data" element={<FakeDataGenerator />} />
                    <Route path="/tools/curl-to-code" element={<CurlToCode />} />
                    <Route path="/tools/html-to-jsx" element={<HtmlToJsx />} />
                    <Route path="/tools/json-to-go" element={<JsonToGoStruct />} />
                    <Route path="/tools/html-to-markdown" element={<HtmlToMarkdown />} />
                    <Route path="/tools/json-to-python" element={<JsonToPython />} />
                    <Route path="/tools/json-to-xml" element={<JsonToXml />} />
                    <Route path="/tools/json-to-rust" element={<JsonToRust />} />
                    <Route path="/tools/json-to-kotlin" element={<JsonToKotlin />} />
                    <Route path="/tools/json-to-swift" element={<JsonToSwift />} />
                    {/* CSS & Design */}
                    <Route path="/tools/color-palette" element={<ColorPaletteGenerator />} />
                    <Route path="/tools/box-shadow" element={<BoxShadowGenerator />} />
                    <Route path="/tools/flexbox" element={<FlexboxPlayground />} />
                    <Route path="/tools/css-grid" element={<CssGridGenerator />} />
                    <Route path="/tools/gradient" element={<GradientGenerator />} />
                    <Route path="/tools/border-radius" element={<BorderRadiusGenerator />} />
                    <Route path="/tools/text-shadow" element={<TextShadowGenerator />} />
                    <Route path="/tools/aspect-ratio" element={<AspectRatioCalculator />} />
                    <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
                    <Route path="/tools/css-unit" element={<CssUnitConverter />} />
                    <Route path="/tools/tailwind" element={<TailwindConverter />} />
                    <Route path="/tools/css-animation" element={<CssAnimationGenerator />} />
                    <Route path="/tools/color-contrast" element={<ColorContrastChecker />} />
                    <Route path="/tools/placeholder-image" element={<PlaceholderImageGenerator />} />
                    <Route path="/tools/clip-path" element={<CssClipPathGenerator />} />
                    <Route path="/tools/color-blindness" element={<ColorBlindnessSimulator />} />
                    <Route path="/tools/css-specificity" element={<CssSpecificityCalculator />} />
                    <Route path="/tools/glassmorphism" element={<GlassmorphismGenerator />} />
                    <Route path="/tools/neumorphism" element={<NeumorphismGenerator />} />
                    <Route path="/tools/css-transition" element={<CssTransitionBuilder />} />
                    <Route path="/tools/svg-path-editor" element={<SvgPathEditor />} />
                    <Route path="/tools/color-mixer" element={<ColorMixer />} />
                    <Route path="/tools/font-pair" element={<FontPairGenerator />} />
                    <Route path="/tools/css-filter-gen" element={<CssFilterGenerator />} />
                    <Route path="/tools/css-columns" element={<CssColumnsGenerator />} />
                    {/* Security */}
                    <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
                    <Route path="/tools/hash-generator" element={<HashGenerator />} />
                    <Route path="/tools/csp-generator" element={<CspGenerator />} />
                    <Route path="/tools/totp-generator" element={<TotpGenerator />} />
                    <Route path="/tools/ssh-keygen" element={<SshKeyGenerator />} />
                    <Route path="/tools/password-strength" element={<PasswordStrengthChecker />} />
                    <Route path="/tools/aes-encryption" element={<AesEncryption />} />
                    <Route path="/tools/cipher-tools" element={<CipherTools />} />
                    <Route path="/tools/hmac-generator" element={<HmacGenerator />} />
                    <Route path="/tools/sri-hash" element={<SriHashGenerator />} />
                    <Route path="/tools/base32" element={<Base32Encoder />} />
                    {/* Networking */}
                    <Route path="/tools/cors-checker" element={<CorsHeaderChecker />} />
                    <Route path="/tools/webhook-tester" element={<WebhookTester />} />
                    <Route path="/tools/dns-lookup" element={<DnsLookup />} />
                    <Route path="/tools/domain-checker" element={<DomainChecker />} />
                    <Route path="/tools/ssl-decoder" element={<SslDecoder />} />
                    <Route path="/tools/http-headers" element={<HttpHeaderInspector />} />
                    <Route path="/tools/dns-propagation" element={<DnsPropagation />} />
                    <Route path="/tools/subnet-calc" element={<SubnetCalculator />} />
                    <Route path="/tools/user-agent-parser" element={<UserAgentParser />} />
                    <Route path="/tools/port-reference" element={<PortReference />} />
                    <Route path="/tools/url-parser" element={<UrlParser />} />
                    <Route path="/tools/http-method-ref" element={<HttpMethodReference />} />
                    {/* PDF */}
                    <Route path="/tools/pdf-merger" element={<PdfMerger />} />
                    <Route path="/tools/pdf-extractor" element={<PdfPageExtractor />} />
                    <Route path="/tools/pdf-metadata" element={<PdfMetadata />} />
                    {/* Image */}
                    <Route path="/tools/image-metadata" element={<ImageMetadata />} />
                    <Route path="/tools/image-resizer" element={<ImageResizer />} />
                    <Route path="/tools/image-colors" element={<ImageColorExtractor />} />
                    <Route path="/tools/image-ascii" element={<ImageToAscii />} />
                    <Route path="/tools/image-convert" element={<ImageFormatConverter />} />
                    <Route path="/tools/image-filters" element={<ImageFilters />} />
                    <Route path="/tools/image-cropper" element={<ImageCropper />} />
                    <Route path="/tools/image-watermark" element={<ImageWatermark />} />
                    <Route path="/tools/image-pixelate" element={<ImagePixelate />} />
                    <Route path="/tools/image-flip-rotate" element={<ImageFlipRotate />} />
                    {/* Math */}
                    <Route path="/tools/unit-converter" element={<UnitConverter />} />
                    <Route path="/tools/percentage-calc" element={<PercentageCalculator />} />
                    <Route path="/tools/date-calculator" element={<DateCalculator />} />
                    <Route path="/tools/timezone-converter" element={<TimezoneConverter />} />
                    <Route path="/tools/age-calculator" element={<AgeCalculator />} />
                    <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
                    <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
                    <Route path="/tools/tip-calculator" element={<TipCalculator />} />
                    <Route path="/tools/discount-calc" element={<DiscountCalculator />} />
                    <Route path="/tools/scientific-calc" element={<ScientificCalculator />} />
                    {/* SEO */}
                    <Route path="/tools/robots-txt" element={<RobotsTxtGenerator />} />
                    <Route path="/tools/sitemap-generator" element={<SitemapGeneratorPage />} />
                    <Route path="/tools/structured-data" element={<StructuredDataGenerator />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </StatsProvider>
        </RecentsProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
