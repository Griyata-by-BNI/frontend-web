import { Col, InputNumber, Row, Select, Slider } from "antd";
import interestRateData from "@/data/interest-rate.json";
import { JobType, AffordabilityParams } from "../_types";

const jobTypes: JobType[] = [
  { value: "karyawan", label: "Karyawan", maxAge: 59 },
  { value: "wiraswasta", label: "Wiraswasta", maxAge: 66 },
  { value: "professional", label: "Professional", maxAge: 66 },
];

const getMaxLoanAge = (jobType: string) => {
  return jobType === "karyawan" ? 59 : 66;
};

interface AffordabilityFormProps {
  params: AffordabilityParams;
  onParamsChange: (params: Partial<AffordabilityParams>) => void;
}

export const AffordabilityForm = ({
  params,
  onParamsChange,
}: AffordabilityFormProps) => {
  const selectedJobType = jobTypes.find((job) => job.value === params.jobType);
  const maxAge = selectedJobType?.maxAge || 66;
  const maxLoanAge = getMaxLoanAge(params.jobType);
  const maxTenor = Math.max(1, maxLoanAge - params.age);

  const selectedRate = interestRateData.find(
    (rate) => rate.id === params.selectedRateId
  );

  const isValidTenor =
    !selectedRate || params.tenor >= selectedRate.minimum_tenor;

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Jenis Pekerjaan</p>

        <Select
          size="large"
          className="w-full"
          value={params.jobType}
          onChange={(value) => {
            const newMaxAge =
              jobTypes.find((j) => j.value === value)?.maxAge || 65;
            const newMaxLoanAge = getMaxLoanAge(value);
            const adjustedAge = Math.min(params.age, newMaxAge);
            const newMaxTenor = Math.max(5, newMaxLoanAge - adjustedAge);
            onParamsChange({
              jobType: value,
              age: adjustedAge,
              tenor: Math.min(params.tenor, newMaxTenor),
            });
          }}
          options={jobTypes.map((job) => ({
            value: job.value,
            label: job.label,
          }))}
        />
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Usia</p>

        <Row align="middle" gutter={16}>
          <Col flex="auto">
            <Slider
              min={21}
              max={maxAge}
              value={params.age}
              onChange={(value) => {
                const newMaxTenor = Math.max(5, maxLoanAge - value);
                onParamsChange({
                  age: value,
                  tenor: Math.min(params.tenor, newMaxTenor),
                });
              }}
            />
          </Col>

          <Col>
            <InputNumber
              size="large"
              controls={false}
              className="!w-[90px]"
              min={21}
              max={maxAge}
              value={params.age}
              onChange={(value) => {
                const newAge = value || 21;
                const newMaxTenor = Math.max(5, maxLoanAge - newAge);
                onParamsChange({
                  age: newAge,
                  tenor: Math.min(params.tenor, newMaxTenor),
                });
              }}
              suffix={<p className="font-semibold text-dark-tosca">tahun</p>}
            />
          </Col>
        </Row>
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">
          Total Penghasilan per Bulan
        </p>

        <InputNumber
          size="large"
          className="!w-full"
          prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => Number(value!.replace(/\Rp\s?|(\.)/g, ""))}
          value={params.monthlyIncome}
          onChange={(value) => onParamsChange({ monthlyIncome: value || 0 })}
        />
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">
          Total Pengeluaran per Bulan
        </p>

        <InputNumber
          size="large"
          className="!w-full"
          prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => Number(value!.replace(/\Rp\s?|(\.)/g, ""))}
          value={params.monthlyExpenses}
          max={params.monthlyIncome}
          onChange={(value) => onParamsChange({ monthlyExpenses: value || 0 })}
          status={params.monthlyExpenses > params.monthlyIncome ? "error" : ""}
        />

        {params.monthlyExpenses > params.monthlyIncome && (
          <p className="text-red-500 text-sm">
            Pengeluaran tidak boleh melebihi penghasilan
          </p>
        )}
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Jangka Waktu (Tenor)</p>

        <Row align="middle" gutter={16}>
          <Col flex="auto">
            <Slider
              min={1}
              max={maxTenor}
              value={params.tenor}
              onChange={(value) => onParamsChange({ tenor: value })}
            />
          </Col>

          <Col>
            <InputNumber
              size="large"
              controls={false}
              className="!w-[90px]"
              min={1}
              max={maxTenor}
              value={Math.min(params.tenor, maxTenor)}
              onChange={(value) => onParamsChange({ tenor: value || 5 })}
              suffix={<p className="font-semibold text-dark-tosca">tahun</p>}
            />
          </Col>
        </Row>

        <p className="text-sm text-gray-500">
          *Maksimum tenor berdasarkan usia saat ini: {maxTenor} tahun (hingga
          usia {maxLoanAge} tahun)
        </p>
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Uang Muka</p>

        <InputNumber
          size="large"
          className="!w-full"
          prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => Number(value!.replace(/\Rp\s?|(\.)/g, ""))}
          value={params.downPayment}
          onChange={(value) => onParamsChange({ downPayment: value || 0 })}
        />
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Angsuran per Bulan</p>

        <InputNumber
          size="large"
          className="!w-full"
          prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => Number(value!.replace(/\Rp\s?|(\.)/g, ""))}
          value={params.monthlyInstallment}
          onChange={(value) =>
            onParamsChange({ monthlyInstallment: value || 0 })
          }
        />

        <p className="text-sm text-gray-500">
          *Maksimum angsuran yang disarankan adalah 30% dari penghasilan bersih
          (Rp{" "}
          {(
            (params.monthlyIncome - params.monthlyExpenses) *
            0.3
          ).toLocaleString("id-ID")}
          )
        </p>
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Pilihan Suku Bunga</p>

        <Select
          placeholder="Pilih suku bunga"
          className="w-full"
          size="large"
          value={params.selectedRateId}
          onChange={(value) => onParamsChange({ selectedRateId: value })}
          options={interestRateData.map((rate) => ({
            key: rate.id,
            value: rate.id,
            label: rate.title,
          }))}
          popupMatchSelectWidth={false}
          status={!isValidTenor ? "error" : ""}
        />

        {!isValidTenor && selectedRate && (
          <p className="text-red-500 text-sm">
            Tenor minimal untuk suku bunga ini adalah{" "}
            {selectedRate.minimum_tenor} tahun
          </p>
        )}
      </div>
    </div>
  );
};
