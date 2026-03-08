import { useState, useMemo } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Keyframe { offset: number; props: Record<string, string> }

const presets: Record<string, Keyframe[]> = {
  "Fade In": [{ offset: 0, props: { opacity: "0" } }, { offset: 100, props: { opacity: "1" } }],
  "Slide Up": [{ offset: 0, props: { transform: "translateY(20px)", opacity: "0" } }, { offset: 100, props: { transform: "translateY(0)", opacity: "1" } }],
  "Bounce": [
    { offset: 0, props: { transform: "translateY(0)" } },
    { offset: 30, props: { transform: "translateY(-30px)" } },
    { offset: 50, props: { transform: "translateY(0)" } },
    { offset: 70, props: { transform: "translateY(-15px)" } },
    { offset: 100, props: { transform: "translateY(0)" } },
  ],
  "Spin": [{ offset: 0, props: { transform: "rotate(0deg)" } }, { offset: 100, props: { transform: "rotate(360deg)" } }],
  "Pulse": [{ offset: 0, props: { transform: "scale(1)" } }, { offset: 50, props: { transform: "scale(1.1)" } }, { offset: 100, props: { transform: "scale(1)" } }],
  "Shake": [
    { offset: 0, props: { transform: "translateX(0)" } },
    { offset: 25, props: { transform: "translateX(-10px)" } },
    { offset: 50, props: { transform: "translateX(10px)" } },
    { offset: 75, props: { transform: "translateX(-10px)" } },
    { offset: 100, props: { transform: "translateX(0)" } },
  ],
};

export default function CssAnimationGenerator() {
  const [name, setName] = useState("myAnimation");
  const [duration, setDuration] = useState([1000]);
  const [timingFn, setTimingFn] = useState("ease");
  const [iterCount, setIterCount] = useState("infinite");
  const [delay, setDelay] = useState([0]);
  const [direction, setDirection] = useState("normal");
  const [keyframes, setKeyframes] = useState<Keyframe[]>(presets["Fade In"]);

  const loadPreset = (key: string) => setKeyframes(presets[key]);

  const updateKeyframeProp = (ki: number, prop: string, val: string) => {
    setKeyframes(prev => prev.map((kf, i) => i === ki ? { ...kf, props: { ...kf.props, [prop]: val } } : kf));
  };

  const css = useMemo(() => {
    const kfStr = keyframes.map(kf => {
      const propsStr = Object.entries(kf.props).map(([k, v]) => `    ${k}: ${v};`).join("\n");
      return `  ${kf.offset}% {\n${propsStr}\n  }`;
    }).join("\n");
    const anim = `animation: ${name} ${duration[0]}ms ${timingFn} ${delay[0]}ms ${iterCount} ${direction};`;
    return `@keyframes ${name} {\n${kfStr}\n}\n\n.animated {\n  ${anim}\n}`;
  }, [name, duration, timingFn, iterCount, delay, direction, keyframes]);

  const inlineStyle = useMemo(() => ({
    animation: `${name} ${duration[0]}ms ${timingFn} ${delay[0]}ms ${iterCount} ${direction}`,
  }), [name, duration, timingFn, iterCount, delay, direction]);

  const styleTag = useMemo(() => {
    const kfStr = keyframes.map(kf => {
      const propsStr = Object.entries(kf.props).map(([k, v]) => `${k}:${v}`).join(";");
      return `${kf.offset}%{${propsStr}}`;
    }).join("");
    return `@keyframes ${name}{${kfStr}}`;
  }, [name, keyframes]);

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="CSS Animation Generator" description="Visually create CSS keyframe animations" />
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Presets</label>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(presets).map(k => (
              <Button key={k} variant="outline" size="sm" className="h-7 text-xs" onClick={() => loadPreset(k)}>{k}</Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-card text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Timing Function</label>
            <Select value={timingFn} onValueChange={setTimingFn}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["ease", "linear", "ease-in", "ease-out", "ease-in-out"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Duration: {duration[0]}ms</label>
            <Slider value={duration} onValueChange={setDuration} min={100} max={5000} step={100} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Delay: {delay[0]}ms</label>
            <Slider value={delay} onValueChange={setDelay} min={0} max={3000} step={100} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Iteration Count</label>
            <Select value={iterCount} onValueChange={setIterCount}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "5", "infinite"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Direction</label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["normal", "reverse", "alternate", "alternate-reverse"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 border border-border rounded-lg bg-card">
          <style>{styleTag}</style>
          <div className="w-16 h-16 rounded-lg bg-primary" style={inlineStyle} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Generated CSS</label>
            <CopyButton text={css} />
          </div>
          <pre className="text-xs font-mono bg-card border border-border rounded p-3 overflow-x-auto whitespace-pre">{css}</pre>
        </div>
      </div>
    </div>
  );
}
