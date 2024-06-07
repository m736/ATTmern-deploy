import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { Button, Form, Modal, Typography, Spin } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import { Table } from "antd";
import {
  deleteInvoiceListAction,
  getInvoiceListAction,
} from "../action/BackDatedInvoiceGenerateAction";

import { useNavigate } from "react-router-dom";
import {
  clearInvoiceError,
  clearInvoiceListDeleted,
  getSingleInvoiceFail,
  getSingleInvoiceRequest,
  getSingleInvoiceSuccess,
} from "../slices/BackDatedInvoSlice";
import axios from "axios";

const InvoiceList = () => {
  const { Title } = Typography;
  const [bordered, setBordered] = useState(true);
  const [pdfDetails, SetPdfDetails] = useState({});
  const [filterClient, setFilterClient] = useState([]);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const tableProps = {
    bordered,
  };
  const { invoice_list, invoiceLoading, error, isInvoiceDeleted } = useSelector(
    (state) => state.BackDateInvoiceGenerateState || []
  );

  const [tabledata, setTabledata] = useState([]);

  useEffect(() => {
    dispatch(getInvoiceListAction);
  }, []);
  useEffect(() => {
    if (invoice_list && invoice_list?.length > 0) {
      let updatedInvoiceList = invoice_list?.map((item) => {
        const InvoiceNum = `${item?.Invoice_No} /23-24`;
        const Created = moment
          .utc(item.createdAt)
          .local()
          .format("DD-MM-YYYY hh:mm A");

        return {
          ...item,
          InvoiceNum,
          Created: Created,
        };
      });
      setTabledata(updatedInvoiceList);
      let clientList = invoice_list.map((item) => {
        console.log(item);
        return {
          text: item.Client,
          value: item.Client,
        };
      });

      setFilterClient(removeDuplicateObjects(clientList, "value"));
    } else {
      setTabledata([]);
    }
  }, [invoice_list]);
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
      title: "Invoice_No",
      dataIndex: "InvoiceNum",
    },
    {
      title: "Invoice_Date",
      dataIndex: "Invoice_Date",
    },
    {
      title: "Client",
      dataIndex: "Client",
      filters: filterClient,
      onFilter: (value, record) => record.Client.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "Total",
      dataIndex: "salesTotalAmount",
    },

    {
      title: "CreatedAt",
      dataIndex: "Created",
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
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <Button
          className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white"
          onClick={() => deleteInvoiceFunc(record)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const downloadPDF = async (id) => {
    const { data } = await axios.get(`/invoice/get_single_invoice/${id}`);
    const pdf = data?.singleInvoice;
    if (pdf) {
      const doc = new jsPDF();

      autoTable(doc, {
        body: [
          [
            {
              content: pdf?.Client,
              styles: {
                halign: "left",
                fontSize: 13,
                textColor: "#ffffff",
              },
            },
            {
              content: "Invoice",
              styles: {
                halign: "right",
                fontSize: 13,
                textColor: "#ffffff",
              },
            },
          ],
        ],
        theme: "plain",
        styles: {
          fillColor: "#3366ff",
        },
      });

      // autoTable(doc, {
      //   body: [
      //     [
      //       {
      //         content:
      //           "Reference: #INV0001" +
      //           "\nDate: 2022-01-27" +
      //           `\nInvoice number: ${pdf?.Invoice_No}`,
      //         styles: {
      //           halign: "right",
      //         },
      //       },
      //     ],
      //   ],
      //   theme: "plain",
      // });

      autoTable(doc, {
        body: [
          [
            {
              content:
                "To:" +
                `\nCompany: ${pdf?.Client}` +
                `\n${pdf?.Address}` +
                `\nCompany: ${pdf?.Client}`,
              styles: {
                halign: "left",
              },
            },

            {
              content:
                "From:" +
                "\nCompany name" +
                "\nShipping Address line 1" +
                "\nShipping Address line 2" +
                "\nZip code - City" +
                "\nCountry",
              styles: {
                halign: "right",
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(doc, {
        body: [
          [
            {
              content: "Amount due:",
              styles: {
                halign: "right",
                fontSize: 14,
              },
            },
          ],
          [
            {
              content: "$4000",
              styles: {
                halign: "right",
                fontSize: 20,
                textColor: "#3366ff",
              },
            },
          ],
          [
            {
              content: "Due date: 2022-02-01",
              styles: {
                halign: "right",
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(doc, {
        body: [
          [
            {
              content: "Products & Services",
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
              content: "Subtotal:",
              styles: {
                halign: "right",
              },
            },
            {
              content: "$3600",
              styles: {
                halign: "right",
              },
            },
          ],
          [
            {
              content: "Total tax:",
              styles: {
                halign: "right",
              },
            },
            {
              content: "$400",
              styles: {
                halign: "right",
              },
            },
          ],
          [
            {
              content: "Total amount:",
              styles: {
                halign: "right",
              },
            },
            {
              content: "$4000",
              styles: {
                halign: "right",
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(doc, {
        body: [
          [
            {
              content: "Terms & notes",
              styles: {
                halign: "left",
                fontSize: 14,
              },
            },
          ],
          [
            {
              content:
                "orem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia" +
                "molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum" +
                "numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium",
              styles: {
                halign: "left",
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(doc, {
        body: [
          [
            {
              content: "This is a centered footer",
              styles: {
                halign: "center",
              },
            },
          ],
        ],
        theme: "plain",
      });

      return doc.save("invoice");
    }
  };
  const deleteInvoiceFunc = (id) => {
    // setCurrentPage(1);
    confirm({
      title: "Do you want to Delete these Invoice Details?",
      icon: <ExclamationCircleFilled />,

      onOk() {
        dispatch(deleteInvoiceListAction(id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const navigate = useNavigate();
  const CreateInvoice = () => {
    navigate("/invoice/invoice_generate");
  };
  useEffect(() => {
    if (isInvoiceDeleted) {
      toast("Invoice Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.TOP_CENTER,
        onOpen: () => dispatch(clearInvoiceListDeleted()),
      });
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearInvoiceError());
        },
      });
      return;
    }
  }, [isInvoiceDeleted, error, dispatch]);
  return (
    <>
      <Spin spinning={invoiceLoading} tip="Loading">
        <div class="flex flex-row items-center justify-between mt-5">
          <Title className="font-bold" level={4}>
            Invoice list
          </Title>
          <Button
            className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
            onClick={CreateInvoice}
          >
            Create Invoice
          </Button>
        </div>
        <Table columns={columns} dataSource={tabledata} {...tableProps} />
      </Spin>
    </>
  );
};

export default InvoiceList;
