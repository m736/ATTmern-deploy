import React from "react";
import TripSheetCalculation from "./TripSheetCalculation";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
const SalesAndPurchaseCalculation = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/tripsheet/new_tripsheet_entry");
  };
  return (
    <>
      <Button htmlType="submit" onClick={handleClick}>
        Go Back
      </Button>
      <div className="flex flex-col mb-14 mt-5">
        <div className="-my-2 overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-bold text-gray-500 border-r border-gray-200  uppercase tracking-wider"
                    >
                      Sales Calculation
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Purchase Calculation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <TripSheetCalculation />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesAndPurchaseCalculation;
