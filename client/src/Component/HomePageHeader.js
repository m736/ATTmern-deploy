import { Button, Dropdown, Space } from "antd";

import { DownOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../action/userAction";
import axios from "axios";
import moment from "moment";

const HomePageHeader = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.authState
  );
  const [stripeApiKey, setStripeApiKey] = useState([]);
  const [notiLength, setNotificationLength] = useState([]);
  const logoutHandler = () => {
    dispatch(logout);
  };
  useEffect(() => {
    async function getStripeApiKey() {
      const { data } = await axios.get(
        "/api/v1/site_mis/sitemis_missing_upload_date"
      );
      setStripeApiKey(data);
      setNotificationLength(data.outputValue.length);
    }
    getStripeApiKey();
  }, []);
  const showWarnToast = () => {
    stripeApiKey?.outputValue?.forEach((comapny) => {
      if (comapny.remainingDates?.length) {
        let dateString = comapny.remainingDates.map((item) =>
          moment(item).format("MMM DD YYYY")
        );
        console.log(dateString);
        toast.warning(
          `${comapny._id}-${
            comapny.remainingDates?.length
          } days missing-${dateString.join(",")}`
        );
      }
    });
  };
  useEffect(() => {
    showWarnToast();
  }, [showWarnToast]);
  const items = [
    {
      key: "1",
      label: "1st menu item",
    },
    {
      key: "2",
      label: "2st menu item",
    },
    {
      key: "3",
      label: "3st menu item",
    },
  ];
  return (
    <>
      {" "}
      {isAuthenticated && (
        <>
          <Dropdown
            menu={{
              items,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {user.name}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          {/* <Dropdown.Button
            className="dropdown-btn"
            overlay={userMenu}
            icon={<UserOutlined />}
          ></Dropdown.Button> */}
          {/* <Button onClick={logoutHandler}>Logout</Button>
          <Button onClick={showWarnToast}>Notification{notiLength}</Button> */}
        </>
      )}
    </>
  );
};

export default HomePageHeader;
