interface InputEditorCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputEditorCard({ value, onChange }: InputEditorCardProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 w-full p-4 glass-surface backdrop-blur-sm border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 font-mono text-sm resize-none transition-all duration-300"
          placeholder="Enter your markdown here..."
        />
      </div>
    </div>
  );
}
