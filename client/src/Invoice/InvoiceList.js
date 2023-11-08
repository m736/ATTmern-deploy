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
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import { Table } from "antd";
import {
  deleteInvoiceListAction,
  getInvoiceListAction,
} from "../action/BackDatedInvoiceGenerateAction";

const ListArea = () => {
  const [bordered, setBordered] = useState(true);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const tableProps = {
    bordered,
  };
  const {
    invoice_list = [],
    invoiceLoading,
    error,
  } = useSelector((state) => state.BackDateInvoiceGenerateState || []);
  useEffect(() => {
    if (invoice_list && invoice_list.length > 0) {
      let updatedInvoiceList = invoice_list.map((item) => {
        const Created = moment
          .utc(item.createdAt)
          .local()
          .format("DD-MM-YYYY hh:mm A");
        return {
          ...item,
          Created: Created,
        };
      });
      // console.log(updatedClient);

      setTabledata(updatedInvoiceList);
    } else {
      dispatch(getInvoiceListAction);
    }
  }, [invoice_list]);
  const [tabledata, setTabledata] = useState([]);
  const columns = [
    {
      title: "Invoice_No",
      dataIndex: "invoice_no",
    },
    {
      title: "Client",
      dataIndex: "client",
    },
    {
      title: "Total",
      dataIndex: "salesTotalAmount",
    },

    {
      title: "createdAt",
      dataIndex: "Created",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <Button
          className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white"
          onClick={() => deleteInvoiceFunc(record?._id)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const deleteInvoiceFunc = (id) => {
    // setCurrentPage(1);
    confirm({
      title: "Do you want to Delete these Invoice Details?",
      icon: <ExclamationCircleFilled />,

      onOk() {
        dispatch(deleteInvoiceListAction(id));
        setTimeout(() => {
          dispatch(getInvoiceListAction);
        }, [1000]);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <>
      <Table columns={columns} dataSource={tabledata} {...tableProps} />
    </>
  );
};

export default ListArea;
