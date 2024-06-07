import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { Button, Form, Modal, Typography, Spin } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  clearProMemoListDeleted,
  clearProMemoListError,
} from "../slices/PurchaseMemoSlice";
import {
  deleteProMemoListAction,
  getProMemoListAction,
} from "../action/PurchaseMemoAction";

const ListPurchaseMemo = () => {
  const { Title } = Typography;
  const [bordered, setBordered] = useState(true);
  const [pdfDetails, SetPdfDetails] = useState({});
  const [filterVehicleNo, setFilterVehicleNo] = useState([]);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const tableProps = {
    bordered,
  };
  const { proMemoLoading, error, pro_memo_detail, isProMemoDeleted } =
    useSelector((state) => state.PurchaseMemoState || []);

  const [tabledata, setTabledata] = useState([]);

  useEffect(() => {
    dispatch(getProMemoListAction);
  }, []);
  useEffect(() => {
    if (pro_memo_detail && pro_memo_detail?.length > 0) {
      let updatedMemoList = pro_memo_detail?.map((item) => {
        const MemoNum = `${item?.purchase_memo_id} /23-24`;

        const Clients = item?.Company_Name.filter(
          (v, i) => item?.Company_Name.indexOf(v) == i
        );
        const Created = moment
          .utc(item.createdAt)
          .local()
          .format("DD-MM-YYYY hh:mm A");

        return {
          ...item,
          MemoNum,
          Clients,
          Created: Created,
        };
      });

      setTabledata(updatedMemoList);
      let vehicleList = pro_memo_detail.map((item) => {
        console.log(item);
        return {
          text: item.Vehicle_No,
          value: item.Vehicle_No,
        };
      });

      setFilterVehicleNo(removeDuplicateObjects(vehicleList, "value"));
    } else {
      setTabledata([]);
    }
  }, [pro_memo_detail]);

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
  const columns = [
    {
      title: "Memo_Id",
      dataIndex: "MemoNum",
    },
    {
      title: "Vehicle No",
      dataIndex: "Vehicle_No",
      filters: filterVehicleNo,
      onFilter: (value, record) => record.Vehicle_No.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "Purchase_Memo_Date",
      dataIndex: "Purchase_Memo_Date",
    },
    {
      title: "Client",
      dataIndex: "Clients",
      render: (Clients) => Clients.map((client) => client).join(),
    },
    {
      title: "Total",
      dataIndex: "Purchase_Nett",
    },
    {
      title: "Download",
      dataIndex: "operation",
      render: (_, record) => (
        <Button
          className="bg-blue-700 hover:bg-blue-400  border-blue-700 hover:border-blue-500 text-white"
          onClick={() => downloadPDF(record?._id)}
        >
          Download
        </Button>
      ),
    },
    {
      title: "CreatedAt",
      dataIndex: "Created",
    },

    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <Button
          className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white"
          onClick={() => deleteMemoFunc(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const downloadPDF = async (id) => {
    const { data } = await axios.get(
      `/api/v1/purchase/get_single_purchase_memo/${id}`
    );
    const pdf = data?.singlePurchase;
    if (pdf) {
      const doc = new jsPDF();

      autoTable(doc, {
        body: [
          [
            {
              content:
                `\nMemo_No: ${pdf?.purchase_memo_id}` +
                `\nMemo_Date: ${pdf?.Purchase_Memo_Date}`,
              styles: {
                halign: "left",
                fontSize: 14,
              },
            },

            {
              content:
                `\nVehicle No: ${pdf?.vehicleDetails?.vehicle_regnumber}` +
                `\nOwner_Name: ${pdf?.vehicleDetails?.owner_name}` +
                `\nVehicle_Type: ${pdf?.vehicleDetails?.vehicle_type}`,
              styles: {
                halign: "right",
                fontSize: 14,
              },
            },
          ],
        ],
        theme: "plain",
        styles: {
          fillColor: "#3366ff",
        },
      });

      autoTable(doc, {
        body: [
          [
            {
              content: "Purchase_Memo Details",
              styles: {
                halign: "left",
                fontSize: 14,
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(doc, {
        head: [["Items", "Category", "Quantity", "Price", "Tax", "Amount"]],
        body: [
          ["Product or service name", "Category", "2", "$450", "$50", "$1000"],
        ],
        theme: "striped",
        headStyles: {
          fillColor: "#343a40",
        },
      });

      autoTable(doc, {
        body: [
          [
            {
              content: "Total amount:",
              styles: {
                halign: "right",
              },
            },
            {
              content: `${pdf?.Purchase_Nett}`,
              styles: {
                halign: "right",
              },
            },
          ],
        ],
        theme: "plain",
      });

      return doc.save(`Purchase-Memo-${pdf?.purchase_memo_id}`);
    }
  };
  const deleteMemoFunc = (data) => {
    // setCurrentPage(1);
    confirm({
      title: "Do you want to Delete these Purchase Memo Details?",
      icon: <ExclamationCircleFilled />,

      onOk() {
        dispatch(deleteProMemoListAction(data));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const navigate = useNavigate();
  const CreateMemo = () => {
    navigate("/purchase_memo/create_purchase_memo");
  };
  useEffect(() => {
    if (isProMemoDeleted) {
      toast("Purchase Memo Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.TOP_CENTER,
        onOpen: () => dispatch(clearProMemoListDeleted()),
      });
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearProMemoListError());
        },
      });
      return;
    }
  }, [isProMemoDeleted, error, dispatch]);
  return (
    <>
      <Spin spinning={proMemoLoading} tip="Loading">
        <div class="flex flex-row items-center justify-between mt-5">
          <Title className="font-bold" level={4}>
            Purchase Memo list
          </Title>
          <Button
            className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
            onClick={CreateMemo}
          >
            Create purchase Memo
          </Button>
        </div>
        <Table columns={columns} dataSource={tabledata} {...tableProps} />
      </Spin>
    </>
  );
};

export default ListPurchaseMemo;
