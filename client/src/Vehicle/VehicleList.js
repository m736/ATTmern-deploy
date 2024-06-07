import { Button, Form, Image, Spin, Table, Space, Typography } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getVechicleAction } from "../action/VehicleInductionAction";

const VehicleList = () => {
  const [bordered, setBordered] = useState(true);
  const [tabledata, setTabledata] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        // let output = [];
        // item.Location.map((item) => {
        //   return output.push(`${item.Client_Location}-${item.Client_GST}`);
        // });
        // console.log(output.join(", "));
        // const ownerArray = item.owners;
        // let currentOwner = ownerArray[ownerArray.length - 1];
        // const ownername = currentOwner.owner_name;
        // const driverArray = item.drivers;
        // let currentDriver = driverArray[driverArray.length - 1];
        // const drivername = currentDriver.driver_name;
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
          // vehicle_owner_name: ownername,
          // vehicle_driver_name: drivername,
          Created: Created,
          Updated: Updated,
        };
      });
      setTabledata(vehhicleDetails);
    } else {
      setTabledata([]);
    }
  }, [vehicle_list]);
  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (isVehicleListUpdated) {
  //     toast("Vehicle Updated Succesfully!", {
  //       type: "success",
  //       position: toast.POSITION.BOTTOM_CENTER,
  //       onOpen: () => dispatch(clearUpdateVehicleListCreated()),
  //     });

  //     return;
  //   }

  //   if (error) {
  //     toast(error, {
  //       position: toast.POSITION.BOTTOM_CENTER,
  //       type: "error",
  //       onOpen: () => {
  //         dispatch(clearError());
  //       },
  //     });
  //     return;
  //   }
  // }, [isVehicleListUpdated, error, dispatch]);
  const columns = [
    {
      title: "Registration_No",
      dataIndex: "vehicle_regnumber",
      fixed: "left",
    },
    {
      title: "Vehicle_Type",
      dataIndex: "vehicle_type",
    },
    {
      title: "Model",
      dataIndex: "vehicle_model",
    },
    {
      title: "Client_name",
      dataIndex: "vehicle_clientnames",
      // render: (vehicle_clientname) =>
      //   vehicle_clientname &&
      //   vehicle_clientname?.map((client) => client).join(),
      // editable: true,
    },
    {
      title: "Driver Name",
      dataIndex: "driver_name",
    },
    {
      title: "Owner Type",
      dataIndex: "owner_type",
    },
    {
      title: "Owner Name",
      dataIndex: "owner_name",
    },
    {
      title: "This Vehicle Owners_list",
      dataIndex: "",
      render: (_, record) => {
        return (
          <Space>
            <Link
              to={`/vehicle/one_vehicle_owners_list/${record?._id}`}
              className="text-blue-600 underline"
            >
              Owners_Detail
            </Link>
          </Space>
        );
      },
    },
    // {
    //   title: "Fitnessdate_Exp",
    //   dataIndex: "FitnessDate",
    //   // editable: true,
    // },
    // {
    //   title: "Insurancedate_Exp",
    //   dataIndex: "InsuranceDate",
    //   // editable: true,
    // },
    {
      title: "PUC",
      dataIndex: "vehicle_puc",
      maxWidth: 50,
      render: (t, r) => (
        <Image
          src={r.vehicle_puc ? r.vehicle_puc : error}
          width={50}
          height={50}
          alt="PUC"
          fallback="data:image/png;base64,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"
        />
      ),
    },

    {
      title: "Created At",
      dataIndex: "Created",
    },
    {
      title: "Updated At",
      dataIndex: "Updated",
    },
    {
      title: "Action",
      dataIndex: "",

      render: (_, record) => {
        return (
          <Space>
            <Link to={`/vehicle/edit_vehicle/${record?._id}`}>
              <Button className="mt-3">Edit</Button>
            </Link>
            <Button
              className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3"
              // onClick={() => deleteClientMasterFun(record?._id)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const CreateNewVehicle = () => {
    navigate("/vehicle/new_vehicle");
  };
  const { Title } = Typography;
  return (
    <>
      <Spin spinning={vehicleListLoading}>
        {/* <div class="flex flex-row items-center justify-end">
        <Button
          className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
          onClick={AddClientMaster}
        >
          Add Client
        </Button>
      </div> */}
        <div class="flex flex-row items-center justify-between mt-5">
          <Title className="font-bold" level={4}>
            Vehicle List
          </Title>
          <Button
            className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
            onClick={CreateNewVehicle}
          >
            New Vehicle
          </Button>
        </div>
        <Table
          id={"vehicle_list"}
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
export default VehicleList;
