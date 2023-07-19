import React, { useState } from "react";
import { Input, Tooltip } from "antd";
const formatNumber = (value) => new Intl.NumberFormat().format(value);
export const NumericInput = (props) => {
  const { value, onChange, id, disabled } = props;
  console.log(props);
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp = value;
    if (value?.length) onChange(valueTemp?.match(/(\d+)/));
  };
  const title = value ? (
    <span className="numeric-input-title">
      {value !== "-" ? formatNumber(Number(value)) : "-"}
    </span>
  ) : (
    "Input a number"
  );
  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        type="number"
        {...props}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={id}
        maxLength={16}
      />
    </Tooltip>
  );
};
