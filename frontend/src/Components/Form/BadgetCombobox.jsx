import React, { useState, useEffect } from 'react';
import {
  EuiComboBox,
  EuiHighlight,
  EuiHealth,
  useEuiPaletteColorBlind,
  useEuiPaletteColorBlindBehindText,
} from '@elastic/eui';

const getOptionsStatic = (visColorsBehindText, options) => {
  return options.map((el, idx) => {
    return {
      value: {
        size: 5,
      },
      label: el.name,
      color: visColorsBehindText[idx],
      id: el.id,
  }
  })
}

export default ({initialOptions, onChangeFn}) => {
  const visColors = useEuiPaletteColorBlind();
  const visColorsBehindText = useEuiPaletteColorBlindBehindText();
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelected] = useState([]);
  useEffect(() => {
    const updatedOptions = getOptionsStatic(visColorsBehindText, initialOptions);
    console.log({updatedOptions})
    setOptions(updatedOptions);
    setSelected([]);
  }, [visColorsBehindText, initialOptions]);

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
    onChangeFn(selectedOptions)
  };

  const onCreateOption = (searchValue, flattenedOptions = []) => {
    if (!searchValue) {
      return;
    }

    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return;
    }

    const newOption = {
      value: searchValue,
      label: searchValue,
    };

    if (
      flattenedOptions.findIndex(
        (option) => option.label.trim().toLowerCase() === normalizedSearchValue
      ) === -1
    ) {
      options.push(newOption);
      setOptions([...options, newOption]);
    }

    setSelected((prevSelected) => [...prevSelected, newOption]);
  };

  const renderOption = (option, searchValue, contentClassName) => {
    const { color, label, value } = option;
    const dotColor = visColors[visColorsBehindText.indexOf(color)];
    return (
      <EuiHealth color={dotColor}>
        <span className={contentClassName}>
          <EuiHighlight search={searchValue}>{label}</EuiHighlight>
          &nbsp;
          <span>({value.size})</span>
        </span>
      </EuiHealth>
    );
  };

  return (
    <EuiComboBox
      aria-label="Поле ввода тэгов урока"
      placeholder="Введите тэги урока"
      options={options}
      selectedOptions={selectedOptions}
      onChange={onChange}
      onCreateOption={onCreateOption}
      renderOption={renderOption}
    />
  );
};