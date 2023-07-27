import { Form, Select } from "antd";
import React from "react";

const TarrifFormTable = (props) => {
  const { tarrif, setTarrifInput, tarrifInput, index, tarrifInputField } =
    props;
  console.log(props);
  const { Option } = Select;
  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <Select style={{ width: "140px" }}>
            {tarrif?.rental?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <Select style={{ width: "140px" }}>
            {tarrif?.rental?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <Select style={{ width: "140px" }}>
            {tarrif?.rental?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <Select style={{ width: "140px" }}>
            {tarrif?.rental?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <Select style={{ width: "140px" }}>
            {tarrif?.rental?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </td>
      </tr>
    </>
  );
};

export default TarrifFormTable;
