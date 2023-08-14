import React from "react";

const TableSalesTripSheetCalculation = (props) => {
  const { calculationItem, data } = props;

  const tarrrifSlabKms = calculationItem?.selectedSlabkms ?? 0;
  const OurTotalKms = data?.totalKm ?? 0;
  const tarrifSlabHrs = Number(calculationItem?.selectedSlabhrs ?? 0);

  const OurTotalHrs = data?.totalHrs ?? 0;
  const OurTotalDays = data?.totalDays ?? 0;
  const tarrifSlabExHrsRate = calculationItem?.salesExHrsRate ?? 0;
  const tarrifSlabExKmsRate = calculationItem?.salesExKmsRate ?? 0;
  const remainingHrs =
    tarrifSlabHrs && OurTotalHrs >= tarrifSlabHrs
      ? OurTotalHrs - tarrifSlabHrs
      : 0;
  let remainingKms =
    tarrrifSlabKms && OurTotalKms >= tarrrifSlabKms
      ? OurTotalKms - tarrrifSlabKms
      : 0;

  const remainingKmsForOutAndDay =
    OurTotalDays > 0 && OurTotalDays * tarrrifSlabKms >= OurTotalKms
      ? OurTotalDays * tarrrifSlabKms
      : OurTotalKms;
  const totalHrsPrice = remainingHrs * tarrifSlabExHrsRate;
  const totalKmsPrice = remainingKms * tarrifSlabExKmsRate;
  const totalKmsPriceForOutAndDay =
    remainingKmsForOutAndDay * tarrifSlabExKmsRate;
  const tarrifSalesRate = calculationItem?.salesRate;
  const gross = totalHrsPrice + totalKmsPrice + tarrifSalesRate;
  const grossForOutAndDay = totalKmsPriceForOutAndDay;
  const nett = gross;

  return (
    <>
      <table>
        <tbody>
          {data?.rental !== "Out Station" ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Total Hours
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {data?.totalHrs} hrs
              </td>
            </tr>
          ) : (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Total Days
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {OurTotalDays} days
              </td>
            </tr>
          )}

          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
              Total Km
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
              {" "}
              {data?.totalKm} kms
            </td>
          </tr>

          {calculationItem?.selectedSlabhrs ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Slab Hours
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200  w-1/2">
                {" "}
                {calculationItem?.selectedSlabhrs} hrs
              </td>
            </tr>
          ) : null}
          {calculationItem?.selectedSlabkms ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Slab Kms
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200  w-1/2">
                {" "}
                {calculationItem?.selectedSlabkms} Kms
              </td>
            </tr>
          ) : null}
          {calculationItem?.salesRate ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Sales Rate:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {calculationItem?.salesRate}
              </td>
            </tr>
          ) : null}
          {calculationItem?.salesGraceTime ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Grace Time
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {calculationItem?.salesGraceTime}
              </td>
            </tr>
          ) : null}
          {data?.rental !== "Out Station" ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Remaining Hours(Total-Slab)
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {remainingHrs} hrs
              </td>
            </tr>
          ) : null}
          {data?.rental !== "Out Station" ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Remaining Kms(Total-Slab):
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {remainingKms} kms
              </td>
            </tr>
          ) : (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Remaining Kms(Total-Slab):
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {remainingKmsForOutAndDay} kms
              </td>
            </tr>
          )}
          {calculationItem?.salesExHrsRate ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Extra Hours Rate:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                ₹ {calculationItem?.salesExHrsRate ?? 0}
              </td>
            </tr>
          ) : null}

          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
              Extra Kms Rate:
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
              {" "}
              ₹ {calculationItem?.salesExKmsRate ?? 0}
            </td>
          </tr>
          {data?.rental !== "Out Station" ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Total Hours Price:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-1/2">
                {" "}
                ₹ {totalHrsPrice}
              </td>
            </tr>
          ) : null}
          {data?.rental !== "Out Station" ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Total Kms Price:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-1/2">
                {" "}
                ₹ {totalKmsPrice}
              </td>
            </tr>
          ) : (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Total Kms Price:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-1/2">
                {" "}
                ₹ {totalKmsPriceForOutAndDay}
              </td>
            </tr>
          )}
          {data?.rental !== "Out Station" ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Gross:
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                ₹{gross}
              </td>
            </tr>
          ) : (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Gross:
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                ₹{grossForOutAndDay}
              </td>
            </tr>
          )}

          {data?.outstationBata ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Outstation Bata:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {data?.outstationBata}
              </td>
            </tr>
          ) : null}

          {data?.salesEscort ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Sales Escort:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {data?.salesEscort}
              </td>
            </tr>
          ) : null}

          {data?.salesNightBata ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Night Bata:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {data?.salesNightBata}
              </td>
            </tr>
          ) : null}
          {data?.parking ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Parking:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {data?.parking}
              </td>
            </tr>
          ) : null}
          {data?.permit ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Permit:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {data?.permit}
              </td>
            </tr>
          ) : null}
          {data?.others ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Others:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {data?.others}
              </td>
            </tr>
          ) : null}
          {data?.advance ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
                Advance:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
                {" "}
                {data?.advance}
              </td>
            </tr>
          ) : null}
          {/* <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border font-bold border-gray-200 uppercase w-10/12">
              Nett:
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-500 border border-gray-200 uppercase w-1/2">
              {" "}
              {nett}
            </td>
          </tr> */}
        </tbody>
      </table>
    </>
  );
};

export default TableSalesTripSheetCalculation;
