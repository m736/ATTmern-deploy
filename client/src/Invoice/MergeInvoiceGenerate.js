import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space } from "antd";
import { MIGInputField } from "./MIGInputField";
import { useDispatch, useSelector } from "react-redux";
import { getClientMasterAction } from "../action/clientMasterAction";
import MergeInvoiceGenerateAddField from "./MergeInvoiceGenerateAddField";
import { MergeInvoiceInputGenerateAction } from "../action/BackDatedInvoiceGenerateAction";

const MergeInvoiceGenerate = () => {
  const [inputFieldObj, setInputFieldObj] = useState(MIGInputField);
  const [MGIInputArr, setMGIInputArr] = useState([]);
  const [clientArr, setClienArr] = useState([]);
  const [clLocation, setClLocation] = useState([]);
  const dispatch = useDispatch();
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );

  useEffect(() => {
    if (client_master_detail && client_master_detail.length) {
      setClienArr(client_master_detail);
      setMGIInputArr([{ ...inputFieldObj, client: client_master_detail }]);
    } else {
      dispatch(getClientMasterAction);
    }
  }, [client_master_detail]);
  const formDetails = () => {
    setMGIInputArr(MGIInputArr);
    dispatch(MergeInvoiceInputGenerateAction(MGIInputArr));
  };
  console.log(MGIInputArr);
  return (
    <>
      <Card>
        {MGIInputArr?.map((item, index) => {
          return (
            <MergeInvoiceGenerateAddField
              key={index}
              screenAdd={"add"}
              MGIInputArr={MGIInputArr}
              setMGIInputArr={setMGIInputArr}
              addField={item}
              setInputFieldObj={setInputFieldObj}
              index={index}
              clientArr={clientArr}
              inputFieldObj={inputFieldObj}
              clLocation={clLocation}
              setClLocation={setClLocation}
            />
          );
        })}
        <Button className="mt-3" onClick={formDetails}>
          Submit
        </Button>
      </Card>
    </>
  );
};

export default MergeInvoiceGenerate;
