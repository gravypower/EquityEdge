// src/components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  value: string | number;
  onChange: (value: string) => void; // This function type must allow for casting in the consumer component
  options?: { label: string; value: string }[];
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, options }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">{label}:</label>
      {type === 'select' ? (
        <select
          className="border rounded p-2"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          {options?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="border rounded p-2"
        />
      )}
    </div>
  );
};

export default InputField;
