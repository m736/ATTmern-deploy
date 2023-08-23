import React, { useState } from "react";
import { Input, Tooltip } from "antd";
const formatNumber = (value) => new Intl.NumberFormat().format(value);
export const NumericInput = (props) => {
  const { value, onChange } = props;

  const handleChange = (e) => {
    const inputValue = e.target.value;

    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
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
      <Input {...props} onChange={handleChange} />
    </Tooltip>
  );
};
