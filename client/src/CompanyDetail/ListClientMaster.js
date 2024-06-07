import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteClientMasterAction,
  getClientMasterAction,
} from "../action/clientMasterAction";
import { toast } from "react-toastify";
import { Button, Space, Pagination, Spin, Modal, Typography } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { Table } from "antd";
import {
  clearClientMasterDeleted,
  clearClientMasterError,
} from "../slices/ClientMasterSlice";
const ListClientMaster = () => {
  const [bordered, setBordered] = useState(true);
  const [company, setCompany] = useState([]);
  const [tabledata, setTabledata] = useState([]);
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const tableProps = {
    bordered,
  };
  const {
    client_master_detail,
    clientMasterLoading,
    isClientMasterDeleted,
    error,
  } = useSelector((state) => state.ClientMasterState);

  useEffect(() => {
    if (isClientMasterDeleted) {
      toast("Client master Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.TOP_CENTER,
        onOpen: () => dispatch(clearClientMasterDeleted()),
      });
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearClientMasterError());
        },
      });
      return;
    }
  }, [isClientMasterDeleted, error, dispatch]);
  const columns = [
    {
      title: "Company Name",
      dataIndex: "Company_Name",
      filters: company,
      onFilter: (value, record) => record.Company_Name.indexOf(value) === 0,
      filterSearch: true,
      fixed: "left",
    },
    {
      title: "Location",
      // dataIndex: "Location",
      render: (_, item) => {
        let output = [];
        item.Location.map((item) => {
          return output.push(`${item.Client_Location}-${item.Client_GST}`);
        });
        return output.join(", ");
      },
    },
    {
      title: "Address",
      dataIndex: "combineAddress",
    },
    {
      title: "Group",
      dataIndex: "selectedGroup",
    },
    {
      title: "Mailto",
      dataIndex: "Mailto",
    },
    {
      title: "Phone No",
      dataIndex: "Phone_No",
    },
    {
      title: "Agreement Validity",
      dataIndex: "Agreement_validity",
    },
    {
      title: "ServiceTax",
      dataIndex: "selectedserviceTax",
    },
    {
      title: "Cess",
      dataIndex: "selectedCess",
    },
    {
      title: "Entity",
      dataIndex: "selectedEntity",
    },
    {
      title: "createdAt",
      dataIndex: "Created",
    },
    {
      title: "updatedAt",
      dataIndex: "Updated",
    },
    {
      title: "Action",
      dataIndex: "",
      fixed: "right",
      render: (_, record) => {
        return (
          <Space>
            <Link to={`/client_master/edit_client_master/${record?._id}`}>
              <Button className="mt-3">Edit</Button>
            </Link>
            <Button
              className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3"
              onClick={() => deleteClientMasterFun(record?._id)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];
  const deleteClientMasterFun = (id) => {
    // setCurrentPage(1);
    confirm({
      title: "Do you want to Delete these Client Details?",
      icon: <ExclamationCircleFilled />,

      onOk() {
        dispatch(deleteClientMasterAction(id));
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    dispatch(getClientMasterAction);
  }, []);
  useEffect(() => {
    if (client_master_detail && client_master_detail.length > 0) {
      let updatedClient = client_master_detail.map((item) => {
        // let output = [];
        // item.Location.map((item) => {
        //   return output.push(`${item.Client_Location}-${item.Client_GST}`);
        // });
        // console.log(output.join(", "));

        const combineAddress = `${item?.Address}-${item?.City}`;
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
          // combineLocation: output.join(", "),
          combineAddress: combineAddress,
          Created: Created,
          Updated: Updated,
        };
      });
      setTabledata(updatedClient);
      let companyList = client_master_detail.map((item) => {
        return {
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompany(removeDuplicateObjects(companyList, "value"));
    } else {
      setTabledata([]);
    }
  }, [client_master_detail]);

  function removeDuplicateObjects(array, property) {
    const uniqueIds = [];
    const unique = array.filter((element) => {
      const isDuplicate = uniqueIds.includes(element[property]);
      if (!isDuplicate) {
        uniqueIds.push(element[property]);
        return true;
      }
      return false;
    });
    return unique;
  }

  const navigate = useNavigate();
  const AddClientMaster = () => {
    navigate("/client_master/new_client_master");
  };
  const { Title } = Typography;
  return (
    <>
      <Spin spinning={clientMasterLoading}>
        <div class="flex flex-row items-center justify-between mt-5">
          <Title className="font-bold" level={4}>
            Client List
          </Title>
          <Button
            className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
            onClick={AddClientMaster}
          >
            Add Client
          </Button>
        </div>
        <Table
          id={"company_list"}
          {...tableProps}
          columns={columns}
          dataSource={tabledata}
          scroll={{
            y: 900,
            x: 2500,
          }}
        />
      </Spin>
    </>
  );
};

export default ListClientMaster;
