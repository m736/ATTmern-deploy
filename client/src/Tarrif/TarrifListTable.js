import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTarrif } from "../action/tarrifAction";
import { Link } from "react-router-dom";

// const TarrifListTable = () => (
//   <Table columns={columns} dataSource={data} onChange={onChange} />

// );

const TarrifListTable = () => {
  const [companies, setCompanies] = useState([]);

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      filters: companies,
      onFilter: (value, record) => record?.company?.startsWith(value),
    },
    {
      title: "VehicleType",
      dataIndex: "vehicleType",
    },
    {
      title: "Action",
      dataIndex: "",
      fixed: "right",
      render: (_, record) => {
        return (
          <Space>
            <Link to={`/tarrif/edit_tarrif_list/${record?._id}`}>
              <Button className="mt-3">Edit</Button>
            </Link>
            <Button className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3">
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];
  const { tarrifData } = useSelector((state) => state.TarrifState);
  const dispatch = useDispatch();
  const [tabledata, setTabledata] = useState([]);
  useEffect(() => {
    dispatch(getTarrif);
  }, []);

  useEffect(() => {
    if (tarrifData && tarrifData.length > 0) {
      tarrifData.map((item) => {
        let companyList = item.companies.map((val) => {
          return val;
        });
        setCompanies(removeDuplicateObjects(companyList, "value"));
      });

      setTabledata(tarrifData);
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

  return (
    <>
      <Table dataSource={tabledata} columns={columns} />
    </>
  );
};
export default TarrifListTable;
