import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WebpackConfigGenerator() {
  const [entry, setEntry] = useState("./src/index.js");
  const [outputPath, setOutputPath] = useState("dist");
  const [outputFile, setOutputFile] = useState("bundle.js");
  const [mode, setMode] = useState<"development" | "production">("production");
  const [devServer, setDevServer] = useState(false);
  const [devServerPort, setDevServerPort] = useState("3000");
  const [loaders, setLoaders] = useState({ babel: true, css: true, sass: false, typescript: false, images: true, fonts: false });
  const [plugins, setPlugins] = useState({ htmlPlugin: true, cleanPlugin: true, miniCss: false, dotenv: false });

  const toggle = (group: "loaders" | "plugins", key: string) => {
    if (group === "loaders") setLoaders(p => ({ ...p, [key]: !p[key as keyof typeof p] }));
    else setPlugins(p => ({ ...p, [key]: !p[key as keyof typeof p] }));
  };

  const generate = (): string => {
    const lines: string[] = [`const path = require('path');`];
    if (plugins.htmlPlugin) lines.push(`const HtmlWebpackPlugin = require('html-webpack-plugin');`);
    if (plugins.cleanPlugin) lines.push(`const { CleanWebpackPlugin } = require('clean-webpack-plugin');`);
    if (plugins.miniCss) lines.push(`const MiniCssExtractPlugin = require('mini-css-extract-plugin');`);
    if (plugins.dotenv) lines.push(`const Dotenv = require('dotenv-webpack');`);
    lines.push("", "module.exports = {");
    lines.push(`  mode: '${mode}',`);
    lines.push(`  entry: '${entry}',`);
    lines.push("  output: {");
    lines.push(`    filename: '${outputFile}',`);
    lines.push(`    path: path.resolve(__dirname, '${outputPath}'),`);
    lines.push("  },");

    // module rules
    const rules: string[] = [];
    if (loaders.babel) rules.push(`      {\n        test: /\\.jsx?$/,\n        exclude: /node_modules/,\n        use: 'babel-loader',\n      }`);
    if (loaders.typescript) rules.push(`      {\n        test: /\\.tsx?$/,\n        exclude: /node_modules/,\n        use: 'ts-loader',\n      }`);
    if (loaders.css) {
      const cssUse = plugins.miniCss ? `[MiniCssExtractPlugin.loader, 'css-loader']` : `['style-loader', 'css-loader']`;
      rules.push(`      {\n        test: /\\.css$/,\n        use: ${cssUse},\n      }`);
    }
    if (loaders.sass) {
      const sassUse = plugins.miniCss ? `[MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']` : `['style-loader', 'css-loader', 'sass-loader']`;
      rules.push(`      {\n        test: /\\.s[ac]ss$/,\n        use: ${sassUse},\n      }`);
    }
    if (loaders.images) rules.push(`      {\n        test: /\\.(png|jpe?g|gif|svg)$/i,\n        type: 'asset/resource',\n      }`);
    if (loaders.fonts) rules.push(`      {\n        test: /\\.(woff2?|eot|ttf|otf)$/i,\n        type: 'asset/resource',\n      }`);

    if (rules.length) {
      lines.push("  module: {");
      lines.push("    rules: [");
      lines.push(rules.join(",\n"));
      lines.push("    ],");
      lines.push("  },");
    }

    // plugins
    const pluginLines: string[] = [];
    if (plugins.cleanPlugin) pluginLines.push("    new CleanWebpackPlugin()");
    if (plugins.htmlPlugin) pluginLines.push("    new HtmlWebpackPlugin({\n      template: './public/index.html',\n    })");
    if (plugins.miniCss) pluginLines.push("    new MiniCssExtractPlugin()");
    if (plugins.dotenv) pluginLines.push("    new Dotenv()");
    if (pluginLines.length) {
      lines.push("  plugins: [");
      lines.push(pluginLines.join(",\n"));
      lines.push("  ],");
    }

    if (loaders.typescript) {
      lines.push("  resolve: {");
      lines.push("    extensions: ['.tsx', '.ts', '.js'],");
      lines.push("  },");
    }

    if (devServer) {
      lines.push("  devServer: {");
      lines.push(`    port: ${devServerPort},`);
      lines.push("    hot: true,");
      lines.push("    open: true,");
      lines.push("  },");
    }

    lines.push("};");
    return lines.join("\n");
  };

  const config = generate();

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader title="Webpack Config Generator" description="Generate webpack.config.js interactively with loaders and plugins" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Entry Point</Label>
            <Input value={entry} onChange={e => setEntry(e.target.value)} className="font-mono text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Output Path</Label>
              <Input value={outputPath} onChange={e => setOutputPath(e.target.value)} className="font-mono text-sm" />
            </div>
            <div>
              <Label className="text-xs">Output File</Label>
              <Input value={outputFile} onChange={e => setOutputFile(e.target.value)} className="font-mono text-sm" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Mode</Label>
            <Select value={mode} onValueChange={v => setMode(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold">Loaders</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {Object.entries(loaders).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <Checkbox checked={v} onCheckedChange={() => toggle("loaders", k)} id={`l-${k}`} />
                  <Label htmlFor={`l-${k}`} className="text-xs">{k}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Plugins</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {Object.entries(plugins).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <Checkbox checked={v} onCheckedChange={() => toggle("plugins", k)} id={`p-${k}`} />
                  <Label htmlFor={`p-${k}`} className="text-xs">{k}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox checked={devServer} onCheckedChange={() => setDevServer(!devServer)} id="ds" />
            <Label htmlFor="ds" className="text-xs">Dev Server</Label>
            {devServer && <Input value={devServerPort} onChange={e => setDevServerPort(e.target.value)} className="w-20 text-xs font-mono" placeholder="Port" />}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">webpack.config.js</label>
            <CopyButton text={config} />
          </div>
          <pre className="bg-card border rounded-md p-4 text-xs font-mono overflow-auto max-h-[600px] whitespace-pre-wrap text-foreground">{config}</pre>
        </div>
      </div>
    </div>
  );
}
