import type { GroupBase, StylesConfig, Theme } from 'react-select';
import { brandColors } from './brandColors';

/** Matches storefront toolbar controls (`text-sm`, ~40px tall). */
const selectTypography = {
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
};

/** Overrides react-select default blue `primary` theme (hover/focus/selected). */
export const clientSelectTheme = (theme: Theme): Theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: brandColors.gold,
    primary75: brandColors.goldHighlight,
    primary50: 'rgba(188, 36, 34, 0.45)',
    primary25: 'rgba(188, 36, 34, 0.12)',
  },
});

export const clientSelectStyles: StylesConfig<unknown, false, GroupBase<unknown>> = {
  control: (base, state) => ({
    ...base,
    ...selectTypography,
    backgroundColor: brandColors.bg,
    borderColor: state.isFocused ? brandColors.gold : brandColors.border,
    color: brandColors.text,
    minHeight: '40px',
    boxShadow: state.isFocused ? `0 0 0 1px ${brandColors.gold}` : 'none',
    '&:hover': { borderColor: brandColors.gold },
  }),
  valueContainer: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: '38px',
  }),
  menu: (base) => ({
    ...base,
    ...selectTypography,
    backgroundColor: brandColors.bg,
    border: `1px solid ${brandColors.border}`,
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    paddingTop: 4,
    paddingBottom: 4,
  }),
  option: (base, state) => {
    const active = state.isFocused || state.isSelected;
    return {
      ...base,
      ...selectTypography,
      backgroundColor: active ? brandColors.gold : 'transparent',
      color: active ? '#FFFFFF' : brandColors.text,
      cursor: 'pointer',
      ':active': {
        backgroundColor: brandColors.gold,
        color: '#FFFFFF',
      },
    };
  },
  singleValue: (base) => ({ ...base, color: brandColors.text, ...selectTypography }),
  placeholder: (base) => ({ ...base, color: brandColors.muted, ...selectTypography }),
  input: (base) => ({ ...base, color: brandColors.text, margin: 0, padding: 0, ...selectTypography }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    paddingTop: 6,
    paddingBottom: 6,
    color: state.isFocused ? brandColors.gold : brandColors.muted,
    '&:hover': { color: brandColors.gold },
  }),
};
