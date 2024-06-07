import { Button, Form, Image, Spin, Table, Space, Typography } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getIndividualVechicleAction,
  getVechicleAction,
} from "../action/VehicleInductionAction";

const MultipleOwnerForOneVehicle = () => {
  const { id } = useParams();
  const [bordered, setBordered] = useState(true);
  const [tabledata, setTabledata] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableProps = {
    bordered,
  };
  const { single_vehicle_list, vehicleListLoading, error } = useSelector(
    (state) => state.VechicleInductionState
  );

  useEffect(() => {
    dispatch(getIndividualVechicleAction(id));
  }, []);
  useEffect(() => {
    if (single_vehicle_list) {
      let ownersDetails = single_vehicle_list?.owners?.map((item) => {
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

          Created: Created,
          Updated: Updated,
        };
      });
      setTabledata(ownersDetails);
    } else {
      setTabledata([]);
    }
  }, [single_vehicle_list]);

  const columns = [
    {
      title: "Owner_Name",
      dataIndex: "owner_name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Email_id",
      dataIndex: "email_id",
    },
    {
      title: "Phone_No",
      dataIndex: "phone_no",
      // editable: true,
    },
    {
      title: "Pancard_No",
      dataIndex: "pancard_no",
    },
    {
      title: "Bank_A/c_No",
      dataIndex: "bank_ccount_no",
    },
    {
      title: "Owner_Type",
      dataIndex: "owner_type",
    },
    {
      title: "Effective Date",
      dataIndex: "effective_date",
    },
    {
      title: "Remark",
      dataIndex: "remark",
    },

    // {
    //   title: "Created At",
    //   dataIndex: "Created",
    // },
    // {
    //   title: "Updated At",
    //   dataIndex: "Updated",
    // },
  ];
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
        <Title
          className="text-center py-3 text-bold uppercase underline"
          level={4}
        >
          {single_vehicle_list?.vehicle_regnumber}-owners list
        </Title>
        <Table
          id={"owners_list"}
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

export default MultipleOwnerForOneVehicle;
