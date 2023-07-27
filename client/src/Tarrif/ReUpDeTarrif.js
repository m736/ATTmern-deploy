import React, { useEffect, useState } from "react";
import { tarrifInputField } from "./CreateNewTarrif";
import TarrifForm from "./TarrifForm";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { getTarrif } from "../action/tarrifAction";

const ReUpDeTarrif = () => {
  const dispatch = useDispatch();
  const { tarrifData, loading } = useSelector((state) => state.TarrifState);
  const [tarrifInput, setTarrifInput] = useState([]);
  const [editableIndex, setEditableIndex] = useState(null);
  const [form] = Form.useForm();
  const fetchVehicleListData = async () => {
    dispatch(getTarrif);
  };

  useEffect(() => {
    fetchVehicleListData();
  }, []);
  useEffect(() => {
    if (tarrifData && tarrifData.length) {
      setTarrifInput(
        tarrifData.map((item) => {
          return {
            ...item,
            editable: false,
          };
        })
      );
    }
  }, [tarrifData]);
  return (
    <div>
      {tarrifInput?.map((item, index) => {
        return (
          <TarrifForm
            screenEdit={"edit"}
            name={index}
            editableIndex={editableIndex}
            setEditableIndex={setEditableIndex}
            tarrifInput={tarrifInput}
            tarrif={item}
            setTarrifInput={setTarrifInput}
            index={index}
            tarrifInputField={tarrifInputField}
          />
        );
      })}
    </div>
  );
};

export default ReUpDeTarrif;
