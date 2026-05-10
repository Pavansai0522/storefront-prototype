import type { GroupBase, StylesConfig } from 'react-select';

export const clientSelectStyles: StylesConfig<unknown, false, GroupBase<unknown>> = {
  control: (base) => ({
    ...base,
    backgroundColor: '#1A1A2E',
    borderColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    minHeight: '44px',
    boxShadow: 'none',
    '&:hover': { borderColor: '#FF6B00' },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#1A1A2E',
    border: '1px solid rgba(255,255,255,0.1)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#FF6B00' : 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({ ...base, color: '#ffffff' }),
  placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.4)' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: 'rgba(255,255,255,0.4)' }),
};
