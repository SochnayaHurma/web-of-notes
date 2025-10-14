import React, { useState, FC, useEffect } from 'react';
import { 
    EuiSelect, 
    useGeneratedHtmlId 
} from '@elastic/eui';

export type Option = {
  value: number | string;
  text: string;
};
type ListOptions = Option[];


interface ComboBoxProps {
  name: string;
  options: ListOptions;
  defaultValue: string;
  onChange: (value: any) => void;
}

const Combobox: FC<ComboBoxProps> = ({options, onChange, name, defaultValue}) => {
  const basicSelectId = useGeneratedHtmlId({ prefix: 'basicSelect' });
  return (
      <EuiSelect
        name={name}
        id={basicSelectId}
        options={options}
        value={defaultValue}
        onChange={(e) => onChange(e)}
        hasNoInitialSelection={true}
        aria-label="Выбор предметной области"
      />
  );
};

export default Combobox