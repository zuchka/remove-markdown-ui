interface InputEditorCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputEditorCard({ value, onChange }: InputEditorCardProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 w-full p-4 bg-white border-3 border-black rounded-md focus:outline-none focus:shadow-[4px_4px_0px_0px_black] font-mono text-sm resize-none transition-shadow"
          placeholder="Enter your markdown here..."
        />
      </div>
    </div>
  );
}
