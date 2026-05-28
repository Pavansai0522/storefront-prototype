import type { GroupBase, StylesConfig } from 'react-select';
import { brandColors } from './brandColors';

export const clientSelectStyles: StylesConfig<unknown, false, GroupBase<unknown>> = {
  control: (base) => ({
    ...base,
    backgroundColor: brandColors.card,
    borderColor: brandColors.border,
    color: brandColors.text,
    minHeight: '44px',
    boxShadow: 'none',
    '&:hover': { borderColor: brandColors.accent },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: brandColors.card,
    border: `1px solid ${brandColors.border}`,
  }),
  option: (base, state) => {
    const active = state.isFocused || state.isSelected;
    return {
      ...base,
      backgroundColor: active ? brandColors.accent : 'transparent',
      color: active ? '#FFFFFF' : brandColors.text,
      cursor: 'pointer',
      ':active': {
        backgroundColor: brandColors.accentHover,
        color: '#FFFFFF',
      },
    };
  },
  singleValue: (base) => ({ ...base, color: brandColors.text }),
  placeholder: (base) => ({ ...base, color: brandColors.muted }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: brandColors.muted }),
};
