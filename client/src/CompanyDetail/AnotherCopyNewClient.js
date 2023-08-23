import React, { useEffect, useState } from "react";
import { clientInputField } from "./ClientMasterInputField";
import { Input, Radio } from "antd";

const NewClientMaster = () => {
  const [allClientMasterList, setAllClientMasterList] =
    useState(clientInputField);
  console.log(allClientMasterList);
  return (
    <div className="w-full max-w-2xl">
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="company"
          >
            Company Name
          </label>
        </div>
        <div className="md:w-2/3">
          <Input
            id="company"
            value={allClientMasterList.Company_Name}
            onChange={(e) => {
              setAllClientMasterList({
                ...allClientMasterList,
                Company_Name: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="city"
          >
            City
          </label>
        </div>
        <div className="md:w-2/3">
          <Input
            id="city"
            value={allClientMasterList.City}
            onChange={(e) => {
              setAllClientMasterList({
                ...allClientMasterList,
                City: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="location"
          >
            Client Location
          </label>
        </div>
        <div className="md:w-2/3">
          <div className="md:flex md:items-center">
            <div className="md:w-6/12 mr-4">
              {" "}
              <Input
                id="location"
                value={allClientMasterList.City}
                onChange={(e) => {
                  setAllClientMasterList({
                    ...allClientMasterList,
                    Location: {
                      ...allClientMasterList.Location,
                      Client_Location: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="md:w-6/12 mr-4">
              {" "}
              <Radio.Group
                value={allClientMasterList?.Location?.selectedEconomicZone}
                onChange={(e) => {
                  setAllClientMasterList({
                    ...allClientMasterList,
                    Location: {
                      ...allClientMasterList.Location,
                      selectedEconomicZone: e.target.value,
                    },
                  });
                }}
              >
                {allClientMasterList?.Location?.Economic_Zone?.map((item) => {
                  return (
                    <Radio key={item.value} value={item.value}>
                      {item.text}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </div>
            <div className="md:w-2/12">
              <button
                className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-2 rounded"
                type="button"
                // onClick={addClientLocation}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      {allClientMasterList?.Location?.selectedEconomicZone === "SEZ" && (
        <>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <div className="md:flex md:items-center">
                <div className="md:w-6/12 mr-4">
                  {" "}
                  <Input />
                </div>
                <div className="md:w-6/12 mr-4">
                  {" "}
                  <Input />
                </div>
              </div>
            </div>
          </div>
        </>
      )}{" "}
      {allClientMasterList?.Location?.selectedEconomicZone === "Non SEZ" && (
        <>
          {" "}
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <div className="md:flex md:items-center">
                <div className="md:w-6/12 mr-4">
                  {" "}
                  <Input />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="button"
            // onClick={newClientMasterDetail}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewClientMaster;
