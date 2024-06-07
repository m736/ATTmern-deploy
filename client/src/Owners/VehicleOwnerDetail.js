import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import {
  Button,
  Form,
  Modal,
  Typography,
  Popconfirm,
  Input,
  Space,
  Spin,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import { Table } from "antd";

import { useNavigate } from "react-router-dom";
import {
  deleteOwnerListAction,
  editOwnerListAction,
  getOwnerListAction,
} from "../action/ownerListAction";
import {
  clearOwnerListDeleted,
  clearOwnerListError,
  clearOwnerListUpdated,
} from "../slices/OwnerSlice";
import { getVehicleTypeAction } from "../action/vehicleTypeAction";
import { getVechicleAction } from "../action/VehicleInductionAction";

const VehicleOwnerDetail = () => {
  const [bordered, setBordered] = useState(true);
  const [tabledata, setTabledata] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const tableProps = {
    bordered,
  };
  const {
    vehicle_list = [],
    vehicleListLoading,
    error,
  } = useSelector((state) => state.VechicleInductionState);

  useEffect(() => {
    dispatch(getVechicleAction);
  }, []);
  useEffect(() => {
    if (vehicle_list && vehicle_list.length > 0) {
      let vehhicleDetails = vehicle_list.map((item) => {
        const ownerArray = item.owners;
        let currentOwner = ownerArray[ownerArray.length - 1];
        const owner_name = currentOwner.owner_name;
        const address = currentOwner.address;
        const email_id = currentOwner.email_id;
        const phone_no = currentOwner.phone_no;
        const pancard_no = currentOwner.pancard_no;
        const bank_ccount_no = currentOwner.bank_ccount_no;
        const bank_name = currentOwner.bank_name;
        const IFSC_code = currentOwner.IFSC_code;
        const bank_branch = currentOwner.bank_branch;
        const remark = currentOwner.remark;
        const effective_date = currentOwner.effective_date;

        const Created = moment
          .utc(item.createdAt)
          .local()
          .format("DD-MM-YYYY hh:mm A");
        const Updated = moment
          .utc(item.updatedAt)
          .local()
          .format("DD-MM-YYYY hh:mm A");

        return {
          ...item,
          owner_name: owner_name,
          address: address,
          email_id: email_id,
          phone_no: phone_no,
          pancard_no: pancard_no,
          bank_ccount_no: bank_ccount_no,
          bank_name: bank_name,
          IFSC_code: IFSC_code,
          bank_branch: bank_branch,
          remark: remark,
          effective_date: effective_date,
          Created: Created,
          Updated: Updated,
        };
      });
      setTabledata(vehhicleDetails);
    } else {
      setTabledata([]);
    }
  }, [vehicle_list]);

  const columns = [
    {
      title: "Vehicle No",
      dataIndex: "vehicle_regnumber",
      fixed: "left",
    },

    {
      title: "Owner Name",
      dataIndex: "owner_name",
      fixed: "left",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Email_Id",
      dataIndex: "email_id",
    },
    {
      title: "Phone_No",
      dataIndex: "phone_no",
    },
    {
      title: "Pancard_No",
      dataIndex: "pancard_no",
    },
    {
      title: "A/C_No",
      dataIndex: "bank_ccount_no",
    },
    {
      title: "Bank_Name",
      dataIndex: "bank_name",
    },
    {
      title: "IFSC Code",
      dataIndex: "IFSC_code",
    },
    {
      title: "Bank_Branch",
      dataIndex: "bank_branch",
    },
    {
      title: "Effective Date",
      dataIndex: "effective_date",
    },
    {
      title: "Remark",
      dataIndex: "remark",
    },
    {
      title: "createdAt",
      dataIndex: "Created",
    },
    {
      title: "updatedAt",
      dataIndex: "Updated",
    },
  ];
  console.log(tabledata);
  const navigate = useNavigate();
  const CreateNewOwner = () => {
    navigate("/owners/new_owner");
  };
  const { Title } = Typography;
  return (
    <>
      <Spin spinning={vehicleListLoading} tip="loading">
        <div class="flex flex-row items-center justify-between mt-5">
          <Title className="font-bold" level={4}>
            Owner List
          </Title>
          <Button
            className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
            onClick={CreateNewOwner}
          >
            New Owner
          </Button>
        </div>
        <Form form={form}>
          <Table
            id={"vehicle_owner_detail"}
            {...tableProps}
            columns={columns}
            dataSource={tabledata}
            scroll={{
              y: 900,
              x: 2500,
            }}
          />
        </Form>
      </Spin>
    </>
  );
};

export default VehicleOwnerDetail;
