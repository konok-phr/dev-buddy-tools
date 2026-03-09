import { useState } from "react";
import { ToolHeader, CopyButton } from "@/components/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LICENSES: Record<string, string> = {
  MIT: `MIT License\n\nCopyright (c) {{year}} {{name}}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.`,
  "Apache-2.0": `Apache License, Version 2.0\n\nCopyright {{year}} {{name}}\n\nLicensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.`,
  "GPL-3.0": `GNU GENERAL PUBLIC LICENSE Version 3\n\nCopyright (C) {{year}} {{name}}\n\nThis program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.\n\nThis program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.`,
  "BSD-3": `BSD 3-Clause License\n\nCopyright (c) {{year}}, {{name}}\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice.\n2. Redistributions in binary form must reproduce the above copyright notice.\n3. Neither the name nor the names of its contributors may be used to endorse or promote products.`,
  ISC: `ISC License\n\nCopyright (c) {{year}}, {{name}}\n\nPermission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.\n\nTHE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES.`,
};

export default function LicenseGenerator() {
  const [type, setType] = useState("MIT");
  const [name, setName] = useState("");
  const [year] = useState(new Date().getFullYear().toString());

  const output = LICENSES[type]?.replace(/{{year}}/g, year).replace(/{{name}}/g, name || "Your Name") || "";

  return (
    <div className="max-w-3xl mx-auto">
      <ToolHeader title="License Generator" description="Generate open source license files for your projects" />
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(LICENSES).map(l => (
          <Button key={l} size="sm" variant={type === l ? "default" : "outline"} onClick={() => setType(l)}>{l}</Button>
        ))}
      </div>
      <div className="mb-4"><Label className="text-sm">Your Name / Organization</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" /></div>
      <div className="flex justify-end mb-1"><CopyButton text={output} /></div>
      <Textarea value={output} readOnly className="font-mono text-xs h-64" />
    </div>
  );
}
