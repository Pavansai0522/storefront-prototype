import type { GroupBase, StylesConfig } from 'react-select';

export const adminSelectStyles: StylesConfig<unknown, false, GroupBase<unknown>> = {
  control: (base) => ({
    ...base,
    backgroundColor: '#0f172a',
    borderColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    minHeight: '44px',
    boxShadow: 'none',
    width: '100%',
    '&:hover': { borderColor: '#FF6B00' },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#1A1A2E',
    border: '1px solid rgba(255,255,255,0.1)',
    zIndex: 100,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
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
