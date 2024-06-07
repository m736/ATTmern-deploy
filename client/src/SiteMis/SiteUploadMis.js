import React, { useState } from "react";
import { Input, Radio, Space, Typography } from "antd";
import SiteSlabBaseMisUpload from "./SiteSlabBaseMisUpload";
import SiteOnCallMisUpload from "./SiteOnCallMisUpload";
import SiteTripBaseMisUpload from "./SiteTripBaseMisUpload";
import SiteDayBaseMisUpload from "./SiteDayBaseMisUpload";
const SiteUploadMis = () => {
  const [value, setValue] = useState(1);
  const { Title } = Typography;
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <>
      <Title className="font-bold underline" level={3}>
        Site MIS Upload
      </Title>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          <Radio value={1}>Slab Base Mis Upload</Radio>
          <Radio value={2}>OnCall Base Mis Upload</Radio>
          <Radio value={3}>Trip Base Mis Upload</Radio>
          <Radio value={4}>Day Base Mis Upload</Radio>
        </Space>
      </Radio.Group>
      {value === 1 ? <SiteSlabBaseMisUpload /> : null}
      {value === 2 ? <SiteOnCallMisUpload /> : null}
      {value === 3 ? <SiteTripBaseMisUpload /> : null}
      {value === 4 ? <SiteDayBaseMisUpload /> : null}
    </>
  );
};

export default SiteUploadMis;
