import React, { useState } from "react";
import { Input, Radio, Space } from "antd";
import SiteSlabBaseMisUpload from "./SiteSlabBaseMisUpload";
const SiteUploadMis = () => {
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          <Radio value={1}>Slab Base Mis Upload</Radio>
        </Space>
      </Radio.Group>
      {value === 1 ? <SiteSlabBaseMisUpload /> : null}
    </>
  );
};

export default SiteUploadMis;
