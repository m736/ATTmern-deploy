import React, { useState } from "react";
import { Input, Radio, Space } from "antd";
import DownloadSiteSlab from "./DownloadSiteSlab";

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
          <Radio value={1}>Slab Base Mis Download</Radio>
        </Space>
      </Radio.Group>

      {value === 1 ? <DownloadSiteSlab /> : null}
    </div>
  );
};

export default DownloadSiteMis;
