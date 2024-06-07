import { Badge, Button, Dropdown, Space, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../action/userAction";
import axios from "axios";
import moment from "moment";
import { BellOutlined } from "@ant-design/icons";

const HomePageHeader = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.authState
  );
  const { site_slab_base_mis_uploadlist } = useSelector(
    (state) => state.SiteSlabBaseState || []
  );
  const [stripeApiKey, setStripeApiKey] = useState([]);
  const [notiLength, setNotificationLength] = useState([]);
  const logoutHandler = () => {
    dispatch(logout);
  };
  const NotiificationFunc = () => {
    stripeApiKey?.outputValue?.forEach((comapny) => {
      console.log(comapny.remainingDates);
      if (comapny.remainingDates?.length) {
        let dateString = comapny.remainingDates.map((item) =>
          moment(item).utc().format("MMM DD YYYY")
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
  const onClick = ({ key }) => {
    if (key == "2") {
      dispatch(logout);
    } else {
      stripeApiKey?.outputValue?.forEach((comapny) => {
        if (comapny.remainingDates?.length) {
          let dateString = comapny.remainingDates.map((item) => {
            moment(item).utc().format("MMM DD YYYY");
          });
          console.log(dateString);
          toast.warning(
            `${comapny._id}-${
              comapny.remainingDates?.length
            } days missing-${dateString.join(",")}`
          );
        }
      });
    }
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
  }, [site_slab_base_mis_uploadlist]);

  const items = [
    {
      key: "1",
      label: `Notification(${notiLength})`,
    },
    {
      key: "2",
      label: "Logout",
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
              onClick,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {user.name}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <Badge count={notiLength} onClick={NotiificationFunc}>
            <BellOutlined />
          </Badge>

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
