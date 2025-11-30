interface NotesFieldProps {
  value: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function NotesField({ value, handleInputChange }: NotesFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Notes</label>
      <textarea
        name="notes"
        value={value}
        onChange={handleInputChange}
        placeholder="Enter notes"
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent resize-none"
      />
    </div>
  );
}
