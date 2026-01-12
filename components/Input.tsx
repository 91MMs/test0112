
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  isSelect?: boolean;
  isSearchable?: boolean; // 新增：是否支持搜索选择
  options?: { value: string; label: string }[];
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  isSelect, 
  isSearchable, 
  options, 
  className = '', 
  id,
  ...props 
}) => {
  const inputStyles = `w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`;

  const renderLabel = (text: string) => {
    return text.split('*').map((part, i, arr) => (
      <React.Fragment key={i}>
        {part}
        {i < arr.length - 1 && <span className="text-red-600 font-bold ml-0.5">*</span>}
      </React.Fragment>
    ));
  };

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {renderLabel(label)}
        </label>
      )}
      
      {isSelect && !isSearchable ? (
        <select id={inputId} className={inputStyles} {...(props as any)}>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : isSearchable ? (
        <>
          <input 
            id={inputId}
            className={inputStyles} 
            list={`${inputId}-list`} 
            {...(props as any)} 
            autoComplete="off"
          />
          <datalist id={`${inputId}-list`}>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </datalist>
        </>
      ) : (
        <input id={inputId} className={inputStyles} {...(props as any)} />
      )}
      
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
