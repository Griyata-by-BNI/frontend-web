import { SingleFixedRate, FixedBerjenjangRate, RateTypeId } from "../../types";

interface InterestRateTableProps {
  data: SingleFixedRate[] | FixedBerjenjangRate[];
  selectedRateType: RateTypeId;
  type: "single" | "berjenjang";
}

export const InterestRateTable = ({
  data,
  selectedRateType,
  type,
}: InterestRateTableProps) => {
  return (
    <div className="overflow-x-auto pb-2">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-gray-50 font-semibold p-3 text-xs">Masa Fixed</th>

            <th className="bg-gray-50 font-semibold p-3 text-xs">Min. Tenor</th>

            <th
              className={`font-semibold p-3 text-xs ${
                selectedRateType === "A"
                  ? "bg-[#E6F2F1] text-[#007A70]"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              Tipe A
            </th>

            <th
              className={`font-semibold p-3 text-xs ${
                selectedRateType === "B"
                  ? "bg-[#E6F2F1] text-[#007A70]"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              Tipe B
            </th>

            <th
              className={`font-semibold p-3 text-xs ${
                selectedRateType === "C"
                  ? "bg-[#E6F2F1] text-[#007A70]"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              Tipe C
            </th>

            <th
              className={`font-semibold p-3 text-xs ${
                selectedRateType === "D"
                  ? "bg-[#E6F2F1] text-[#007A70]"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              Tipe D
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => {
            const groupKey = type === "single" ? "fixedPeriod" : "minTenor";
            const isFirstOfGroup =
              index === 0 || row[groupKey] !== data[index - 1][groupKey];
            const groupSize = data.filter(
              (r) => r[groupKey] === row[groupKey]
            ).length;

            return (
              <tr key={index}>
                {type === "single" ? (
                  <>
                    {isFirstOfGroup && (
                      <td
                        rowSpan={groupSize}
                        className="p-3 text-center align-middle border-b border-gray-200 text-sm"
                      >
                        {row.fixedPeriod}
                      </td>
                    )}

                    <td className="p-3 text-center align-middle border-b border-gray-200 text-sm">
                      {row.minTenor}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 text-center align-middle border-b border-gray-200 text-sm">
                      {row.fixedPeriod}
                    </td>

                    {isFirstOfGroup && (
                      <td
                        rowSpan={groupSize}
                        className="p-3 text-center align-middle border-b border-gray-200 text-sm"
                      >
                        {row.minTenor}
                      </td>
                    )}
                  </>
                )}
                {(["A", "B", "C", "D"] as const).map((rateType) => (
                  <td
                    key={rateType}
                    className={`p-3 text-center align-middle border-b border-gray-200 text-sm transition-colors duration-300 ${
                      selectedRateType === rateType
                        ? "bg-[#E6F2F1] font-semibold text-[#007A70]"
                        : "bg-transparent font-normal text-gray-800"
                    } ${
                      row.rates[rateType] === "-"
                        ? "bg-gray-100 text-gray-400 italic"
                        : ""
                    }`}
                  >
                    {row.rates[rateType]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
