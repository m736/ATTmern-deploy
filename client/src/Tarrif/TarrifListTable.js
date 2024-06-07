import React, { useEffect, useState } from "react";
import { Table, Button, Space, Spin, Modal, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteTarrif, getTarrif } from "../action/tarrifAction";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { clearTarrifDeleted, clearTarrifError } from "../slices/TarrifSlice";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";

const TarrifListTable = () => {
  const [companies, setCompanies] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bordered, setBordered] = useState(true);
  const tableProps = {
    bordered,
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      fixed: "left",
      width: "200px",
      filters: companies,
      onFilter: (value, record) => record?.company?.startsWith(value),
    },
    {
      title: "VehicleType",
      dataIndex: "vehicleType",
      fixed: "left",
      width: "150px",
      filters: vehicles,
      onFilter: (value, record) => record?.vehicleType?.startsWith(value),
    },
    {
      title: "Rental",
      dataIndex: "selectedRental",
      fixed: "left",
    },
    {
      title: "Segment",
      dataIndex: "selectedSegment",
    },
    {
      title: "Area",
      dataIndex: "selectedArea",
    },
    {
      title: "Slab Hours",
      dataIndex: "selectedSlabhrs",
    },
    {
      title: "Slab Kms",
      dataIndex: "selectedSlabkms",
    },
    {
      title: "Slab From",
      dataIndex: "selectedSlabfrom",
    },
    {
      title: "Slab To",
      dataIndex: "selectedSlabto",
    },
    {
      title: "Add On",
      dataIndex: "selectedAddon",
    },
    {
      title: "Sales Rate",
      dataIndex: "salesRate",
    },
    {
      title: "Purchase Rate",
      dataIndex: "purchaseRate",
    },
    {
      title: "Sales Ex Kms Rate",
      dataIndex: "salesExKmsRate",
    },
    {
      title: "Purchase Ex Kms Rate",
      dataIndex: "purchaseExKmsRate",
    },
    {
      title: "Sales Ex Hrs Rate",
      dataIndex: "salesExHrsRate",
    },
    {
      title: "Purchase Ex Hrs Rate",
      dataIndex: "purchaseExHrsRate",
    },
    {
      title: "Sales Grace Time",
      dataIndex: "salesGraceTime",
    },
    {
      title: "Purchase Grace Time",
      dataIndex: "purchaseGraceTime",
    },
    {
      title: "Driver Bata",
      dataIndex: "driverbata",
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
      width: "150px",
      fixed: "right",
      render: (_, record) => {
        return (
          <Space>
            <Link to={`/tarrif/edit_tarrif_list/${record?._id}`}>
              <Button className="mt-3">Edit</Button>
            </Link>
            <Button
              className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3"
              onClick={() => deleteSingleTarrifFunc(record?._id)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];
  const { tarrifData, loading, isTarrifDeleted, error } = useSelector(
    (state) => state.TarrifState
  );
  const dispatch = useDispatch();
  const [tabledata, setTabledata] = useState([]);
  const { confirm } = Modal;
  useEffect(() => {
    dispatch(getTarrif);
  }, []);
  console.log(tarrifData);

  useEffect(() => {
    if (tarrifData && tarrifData.length > 0) {
      tarrifData.map((item) => {
        let companyList = item.companies.map((val) => {
          return val;
        });
        let vehicleList = item.vehicleTypes.map((val) => {
          return val;
        });
        setCompanies(removeDuplicateObjects(companyList, "value"));
        setVehicles(removeDuplicateObjects(vehicleList, "value"));
      });
      let DateFieldTarrif = tarrifData.map((item) => {
        const selectedSlabhrs = item?.selectedSlabhrs
          ? item?.selectedSlabhrs + " " + "Hrs"
          : "-";
        const selectedSlabkms = item?.selectedSlabkms
          ? item?.selectedSlabkms + " " + "Kms"
          : "-";
        const selectedSlabfrom = item?.selectedSlabfrom
          ? item?.selectedSlabfrom
          : "-";
        const selectedSlabto = item?.selectedSlabto
          ? item?.selectedSlabto
          : "-";
        const selectedAddon = item?.selectedAddon ? item?.selectedAddon : "-";
        const salesRate = item?.salesRate ? item?.salesRate : "-";
        const purchaseRate = item?.purchaseRate ? item?.purchaseRate : "-";
        const salesExKmsRate = item?.salesExKmsRate
          ? item?.salesExKmsRate
          : "-";
        const purchaseExKmsRate = item?.purchaseExKmsRate
          ? item?.purchaseExKmsRate
          : "-";
        const salesExHrsRate = item?.salesExHrsRate
          ? item?.salesExHrsRate
          : "-";
        const purchaseExHrsRate = item?.purchaseExHrsRate
          ? item?.purchaseExHrsRate
          : "-";
        const salesGraceTime = item?.salesGraceTime
          ? item?.salesGraceTime
          : "-";
        const purchaseGraceTime = item?.purchaseGraceTime
          ? item?.purchaseGraceTime
          : "-";
        const driverbata = item?.driverbata ? item?.driverbata : "-";

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
          selectedSlabhrs: selectedSlabhrs,
          selectedSlabkms: selectedSlabkms,
          selectedSlabfrom: selectedSlabfrom,
          selectedSlabto: selectedSlabto,
          selectedAddon: selectedAddon,
          salesRate: salesRate,
          purchaseRate: purchaseRate,
          purchaseExKmsRate: purchaseExKmsRate,
          salesExHrsRate: salesExHrsRate,
          purchaseExHrsRate: purchaseExHrsRate,
          salesGraceTime: salesGraceTime,
          purchaseGraceTime: purchaseGraceTime,
          driverbata: driverbata,
          salesExKmsRate: salesExKmsRate,
          Created: Created,
          Updated: Updated,
        };
      });
      setTabledata(DateFieldTarrif);
    } else {
      setTabledata([]);
    }
  }, [tarrifData]);
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
  const deleteSingleTarrifFunc = (id) => {
    confirm({
      title: "Do you want to Delete these Tarrif Details?",
      icon: <ExclamationCircleFilled />,

      onOk() {
        dispatch(deleteTarrif(id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  useEffect(() => {
    if (isTarrifDeleted) {
      toast("Tarrif master Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearTarrifDeleted()),
      });

      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearTarrifError());
        },
      });
      return;
    }
  }, [isTarrifDeleted, error, dispatch]);
  const navigate = useNavigate();
  const AddTarrifMaster = () => {
    navigate("/tarrif/new_tarrif");
  };
  const { Title } = Typography;
  return (
    <>
      <Spin spinning={loading} tip="loading">
        <div class="flex flex-row items-center justify-between mt-5">
          <Title className="font-bold" level={4}>
            Tarrif List
          </Title>
          <Button
            className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
            onClick={AddTarrifMaster}
          >
            New tarrif
          </Button>
        </div>
        <Table
          {...tableProps}
          dataSource={tabledata}
          columns={columns}
          scroll={{
            x: 2500,
          }}
        />
      </Spin>
    </>
  );
};
export default TarrifListTable;
