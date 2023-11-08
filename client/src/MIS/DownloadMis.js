import React, { useState } from "react";
import { Input, Radio, Space } from "antd";
import DownloadOnCallMisData from "./DownloadOnCallMisData";
import DownloadSlabBaseMis from "./DownloadSlabBaseMis";
import DownloadTripBaseMis from "./DownloadTripBaseMis";
import DownloadDayBaseMis from "./DownloadDayBaseMis";

const DownloadMis = () => {
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <div>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          <Radio value={1}>OnCall Mis Download</Radio>
          <Radio value={2}>Slab Base Mis Download</Radio>
          <Radio value={3}>Trip Base Mis Download</Radio>
          <Radio value={4}>Day Base Mis Download</Radio>
        </Space>
      </Radio.Group>

      {value === 1 ? <DownloadOnCallMisData /> : null}
      {value === 2 ? <DownloadSlabBaseMis /> : null}
      {value === 3 ? <DownloadTripBaseMis /> : null}
      {value === 4 ? <DownloadDayBaseMis /> : null}
    </div>
  );
};

export default DownloadMis;
