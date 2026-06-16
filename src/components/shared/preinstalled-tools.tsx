import type { FC } from 'react';

interface PreinstalledToolsProps {
  tools: string[];
}

export const PreinstalledTools: FC<PreinstalledToolsProps> = ({ tools }) => (
  <div>
    <span className="text-muted-foreground">Tools</span>
    <div className="mt-1 flex flex-wrap gap-1">
      {tools.map((tool) => (
        <span key={tool} className="rounded bg-muted px-2 py-0.5 text-xs">
          {tool}
        </span>
      ))}
    </div>
  </div>
);
