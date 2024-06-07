import React, { useState } from "react";
import { Input, Radio, Space } from "antd";
import DownloadSiteMisData from "./DownloadSiteMisData";

const DownloadSiteMis = () => {
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <div>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          <Radio value={1}>Site Mis Download</Radio>
        </Space>
      </Radio.Group>

      {value === 1 ? <DownloadSiteMisData /> : null}
    </div>
  );
};

export default DownloadSiteMis;
