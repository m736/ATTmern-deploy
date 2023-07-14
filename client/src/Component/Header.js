import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
const items = [
  {
    label: <Link to="/">Excel Upload</Link>,
    key: "import",
  },
  {
    label: <Link to="/table">Table Data</Link>,
    key: "table",
  },
];
const Header = () => {
  return (
    <>
      <Menu
        mode="horizontal"
        items={items}
        style={{ justifyContent: "flex-end" }}
      />
    </>
  );
  // <Menu  mode="horizontal" items={items} style={{justifyContent: 'flex-end'}} />;
};
export default Header;
