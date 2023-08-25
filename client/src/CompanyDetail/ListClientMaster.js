import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteClientMasterAction,
  getClientMasterAction,
} from "../action/clientMasterAction";
import { Button, Space, Pagination } from "antd";
import { Link } from "react-router-dom";
// import Pagination from "react-js-pagination";
const ListClientMaster = () => {
  const [showClientDetails, setShowClientDetails] = useState([]);
  const dispatch = useDispatch();
  const { client_master_detail, clientMasterLoading, page_count, resPerPage } =
    useSelector((state) => state.ClientMasterState || []);
  const [currentPage, setCurrentPage] = useState(1);

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    dispatch(getClientMasterAction(null, null, null, null, currentPage));
  }, [dispatch, currentPage]);
  const deleteClientMasterFun = (id) => {
    dispatch(deleteClientMasterAction(id));
    setTimeout(() => {
      dispatch(getClientMasterAction);
    }, [1000]);
  };

  return (
    <>
      <div className="flex flex-col mb-14">
        <div className="-my-2 overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 border-r border-gray-200  uppercase tracking-wider"
                    >
                      Company Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Client Location
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 border-r border-gray-200  uppercase tracking-wider"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Group
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Mailto
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Telephone
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Agreement Validity
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Service Tax
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Cess
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Entity
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs  text-blue-500 font-bold uppercase tracking-wider border-r border-gray-200"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {client_master_detail &&
                    client_master_detail?.map((clientInfo, index) => {
                      return (
                        <tr>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.Company_Name}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.Location.map(
                              (clientLocationdetail) => {
                                return (
                                  <div>
                                    {`${clientInfo?.City}-${
                                      clientLocationdetail?.Client_Location ??
                                      ""
                                    }-${
                                      clientLocationdetail?.selectedEconomicZone
                                    }`}
                                  </div>
                                );
                              }
                            )}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            <div>{clientInfo?.Address}</div>
                            {","}
                            {`${clientInfo?.City ?? ""}-${clientInfo?.Pincode}`}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.selectedGroup}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.Mailto}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.Telephone}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.Phone_No}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.Agreement_validity}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.selectedserviceTax}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.selectedCess}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {clientInfo?.selectedEntity}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            <Space>
                              <Link
                                to={`/client_master/edit_client_master/${clientInfo?._id}`}
                              >
                                <Button className="mt-3">Edit</Button>
                              </Link>

                              <Button
                                className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3"
                                onClick={() =>
                                  deleteClientMasterFun(clientInfo?._id)
                                }
                              >
                                Delete
                              </Button>
                            </Space>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {page_count > 0 && page_count > resPerPage ? (
        // <Pagination
        //   activePage={currentPage}
        //   onChange={setCurrentPageNo}
        //   totalItemsCount={page_count}
        //   itemsCountPerPage={resPerPage}
        //   nextPageText={"Next"}
        //   firstPageText={"First"}
        //   lastPageText={"Last"}
        //   itemClass={"page-item"}
        //   linkClass={"page-link"}
        // />
        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            onChange={setCurrentPageNo}
            total={page_count}
            pageSize={resPerPage}
          />
        </div>
      ) : null}
    </>
  );
};

export default ListClientMaster;
