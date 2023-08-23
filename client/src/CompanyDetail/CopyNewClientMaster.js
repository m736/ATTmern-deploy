import React, { useEffect, useState } from "react";
import { clientInputField } from "./ClientMasterInputField";
import { Input, Radio } from "antd";
import ClientMasterDetail from "./ClientMasterDetail";

const NewClientMaster = () => {
  const [allClientMasterList, setAllClientMasterList] = useState([
    clientInputField,
  ]);

  return (
    <>
      {allClientMasterList.map((item, index) => {
        return (
          <ClientMasterDetail
            key={index}
            screenAdd={"add"}
            name={index}
            allClientMasterList={allClientMasterList}
            individualData={item}
            setAllClientMasterList={setAllClientMasterList}
            clientInputField={clientInputField}
          />
        );
      })}
    </>
  );
};

export default NewClientMaster;
