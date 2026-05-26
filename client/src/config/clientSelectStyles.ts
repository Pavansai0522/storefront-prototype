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
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? brandColors.accent : 'transparent',
    color: brandColors.text,
    cursor: 'pointer',
  }),
  singleValue: (base) => ({ ...base, color: brandColors.text }),
  placeholder: (base) => ({ ...base, color: brandColors.muted }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: brandColors.muted }),
};
