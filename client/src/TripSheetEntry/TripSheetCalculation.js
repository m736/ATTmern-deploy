import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTarrif } from "../action/tarrifAction";
import TableSalesTripSheetCalculation from "./TableSalesTripSheetCalculation";

const TripSheetCalculation = () => {
  const location = useLocation();
  const data = location.state;

  const [calculation, setCalculation] = useState([]);
  const dispatch = useDispatch();
  const { tarrifData, loading } = useSelector((state) => state.TarrifState);

  useEffect(() => {
    if (tarrifData?.length) {
      let filterData = tarrifData.filter(
        (item) =>
          data?.companyName == item?.company &&
          data?.vehicleBilled == item?.vehicleType &&
          data?.rental == item?.selectedRental &&
          data?.acType == item?.selectedSegment
      );
      if (data?.rental != "out_station") {
        if (data?.totalHrs) {
          let graceTimeFilter = filterData.filter((item) => {
            let totalHrs = Number(item?.selectedSlabhrs);
            if (item?.salesGraceTime) {
              totalHrs += Number(item?.salesGraceTime);
            }

            return Number(data?.totalHrs) <= totalHrs;
          });
          if (graceTimeFilter.length) {
            filterData = [...graceTimeFilter];
          } else {
            filterData = [filterData[filterData.length - 1]];
          }
        }
      }
      filterData = filterData?.sort(
        (a, b) => Number(a?.selectedSlabhrs) - Number(b?.selectedSlabhrs)
      );
      setCalculation([filterData[0]]);
    } else {
      dispatch(getTarrif);
    }
  }, [tarrifData]);
  // console.log(tarrifData);
  // console.log(singleOnCallData);

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
