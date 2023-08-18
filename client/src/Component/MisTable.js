import moment from "moment";
import { Button, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { Excel } from "antd-table-saveas-excel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getVechicle } from "../action/getVehicleAction";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
const MisTable = ({ data }) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [bordered, setBordered] = useState(true);
  const tableProps = {
    bordered,
  };

  const [company, setCompany] = useState([]);
  const [time, setTime] = useState([]);
  const [date, setDate] = useState([]);
  const columns = [
    {
      title: "ID",
      dataIndex: "jokeId",
      // fixed: 'left',
    },
    {
      title: "Vechicle_no",
      dataIndex: "vechicle_no",
    },
    {
      title: "Company",
      dataIndex: "company",
      filters: company,
      onFilter: (value, record) => record.company.indexOf(value) === 0,
    },
    {
      title: "Trip",
      dataIndex: "trip",
    },
    {
      title: "Date",
      dataIndex: "newDate",
      filters: date,
      onFilter: (value, record) => record.date.indexOf(value) === 0,
    },
    {
      title: "Slip No",
      dataIndex: "slipno",
    },
    {
      title: "Time",
      dataIndex: "time",
      filters: time,
      onFilter: (value, record) => record.time.indexOf(value) === 0,
    },
    {
      title: "P_D",
      dataIndex: "p_d",
    },
    {
      title: "Distance",
      dataIndex: "distance",
    },
    {
      title: "Start Location",
      dataIndex: "s_location",
    },
    {
      title: "End Location",
      dataIndex: "e_location",
    },
  ];
  useEffect(() => {
    if (data.length) {
      let companyList = data.map((item) => {
        return {
          text: item.company,
          value: item.company,
        };
      });
      let TimeList = data.map((item) => {
        return {
          text: item.time,
          value: item.time,
        };
      });
      let DateList = data.map((item) => {
        return {
          text: item.date,
          value: item.date,
        };
      });
      setDate(removeDuplicateObjects(DateList, "value"));
      setTime(removeDuplicateObjects(TimeList, "value"));
      setCompany(removeDuplicateObjects(companyList, "value"));
    }
  }, [data]);

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

  const [tabledata, setTabledata] = useState([]);
  useEffect(() => {
    if (data && data.length) {
      let updatedData = data.map((item) => {
        return {
          ...item,
          newDate: moment(new Date(item.date)).format("DD-MM-YYYY"),
        };
      });
      setTabledata(updatedData);
    }
  }, [data]);

  const downloadSearchMisData = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(columns)
      .addDataSource(tabledata, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };
  const deleteStudent = () => {
    try {
      const { res } = axios.delete(
        "http://localhost:4000/bulk/delete-vehiclelist",
        { data: data }
      );
      alert(`${data.length} vechicle data deleted successfully`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {data.length ? (
        <>
          <Row>
            <Button
              className="mb-3 me-3"
              type="success"
              onClick={downloadSearchMisData}
            >
              Download MIS Data
            </Button>
            <Button type="warning" onClick={deleteStudent}>
              Delete
            </Button>
          </Row>

          <Table
            id="table-to-xls"
            {...tableProps}
            columns={columns}
            dataSource={tabledata}
            onChange={onChange}
            rowKey={(record) => record._id}
          />
          {/* <Table  {...tableProps} columns={columns} dataSource={tabledata} scroll={{ x: 1500, y: 300 }} onChange={onChange} rowKey={(record) => record._id}  /> */}
        </>
      ) : (
        <>
          <Table
            locale={{ emptyText: "No data" }}
            {...tableProps}
            columns={columns}
          />
        </>
      )}
    </>
  );
};
export default MisTable;
