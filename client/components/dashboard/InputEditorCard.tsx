interface InputEditorCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputEditorCard({ value, onChange }: InputEditorCardProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full min-h-[450px] p-6 glass-surface backdrop-blur-sm border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:shadow-glass-lg font-mono text-sm resize-none transition-all duration-300"
      placeholder="Enter your markdown here..."
    />
  );
}
