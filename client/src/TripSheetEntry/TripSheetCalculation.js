import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTarrif } from "../action/tarrifAction";
import TableSalesTripSheetCalculation from "./TableSalesTripSheetCalculation";
const TripSheetCalculation = () => {
  const location = useLocation();
  const data = location.state;
  console.log(data);
  const [calculation, setCalculation] = useState([]);
  const dispatch = useDispatch();
  const { tarrifData, loading } = useSelector((state) => state.TarrifState);

  useEffect(() => {
    if (tarrifData?.length) {
      const filterData = tarrifData.filter(
        (item) =>
          data?.companyName == item?.company &&
          data?.vehicleBilled == item?.vehicleType &&
          data?.rental == item?.selectedRental &&
          data?.acType == item?.selectedSegment
      );
      console.log(filterData);
      setCalculation(filterData);
    } else {
      dispatch(getTarrif);
    }
  }, [tarrifData]);
  console.log(calculation);
  return (
    <>
      <tr className="w-full">
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase w-1/2">
            {calculation?.length &&
              calculation.map((calculationItem) => (
                <TableSalesTripSheetCalculation
                  calculationItem={calculationItem}
                  data={data}
                />
              ))}
          </td>
        </>

        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase w-1/2">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
              Total Hours
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border  border-gray-200 uppercase w-1/2">
              {" "}
              {data.totalHrs}
            </td>
          </tr>
        </td> */}
      </tr>
    </>
  );
};

export default TripSheetCalculation;
