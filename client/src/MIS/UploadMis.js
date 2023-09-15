import React, { useState } from "react";
import { Input, Radio, Space } from "antd";
import OnCallMISUpload from "./OnCallMISUpload";
import SlabBaseMisUpload from "./SlabBaseMisUpload";
import TripBaseMisUpload from "./TripBaseMisUpload";
import DayBaseMisUpload from "./DayBaseMisUpload";

const UploadMis = () => {
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          <Radio value={1}>OnCall Mis Upload</Radio>
          <Radio value={2}>Slab Base Mis Upload</Radio>
          <Radio value={3}>Trip Base Mis Upload</Radio>
          <Radio value={4}>Day Base Mis Upload</Radio>
        </Space>
      </Radio.Group>

      {value === 1 ? <OnCallMISUpload /> : null}
      {value === 2 ? <SlabBaseMisUpload /> : null}
      {value === 3 ? <TripBaseMisUpload /> : null}
      {value === 4 ? <DayBaseMisUpload /> : null}
    </>
  );
};

export default UploadMis;
