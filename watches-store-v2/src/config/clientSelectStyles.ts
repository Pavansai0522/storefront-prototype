import type { GroupBase, StylesConfig } from 'react-select';

export const clientSelectStyles: StylesConfig<unknown, false, GroupBase<unknown>> = {
  control: (base) => ({
    ...base,
    backgroundColor: '#07070D',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#F4F4FA',
    minHeight: '44px',
    boxShadow: 'none',
    '&:hover': { borderColor: '#8B5CF6' },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#07070D',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#8B5CF6' : 'transparent',
    color: '#F4F4FA',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({ ...base, color: '#F4F4FA' }),
  placeholder: (base) => ({ ...base, color: '#9494B8' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: '#9494B8' }),
};
