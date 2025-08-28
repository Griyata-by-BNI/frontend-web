import { Col, InputNumber, Row, Select, Slider } from "antd";
import interestRateData from "@/data/interest-rate.json";
import { InterestRate } from "../_types";

interface KPRFormProps {
  propertyPrice: number;
  downPayment: number;
  tenor: number;
  selectedRate: InterestRate | null;
  isValidTenor: boolean;
  onPropertyPriceChange: (value: number) => void;
  onDownPaymentChange: (value: number) => void;
  onTenorChange: (value: number) => void;
  onRateChange: (rate: InterestRate | null) => void;
}

export const KPRForm = ({
  propertyPrice,
  downPayment,
  tenor,
  selectedRate,
  isValidTenor,
  onPropertyPriceChange,
  onDownPaymentChange,
  onTenorChange,
  onRateChange,
}: KPRFormProps) => {
  const minDownPayment = propertyPrice * 0.1;
  const maxDownPayment = propertyPrice * 0.8;

  const isDownPaymentValid =
    downPayment >= minDownPayment && downPayment <= maxDownPayment;

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Harga Properti</p>

        <InputNumber
          size="large"
          className="!w-full"
          prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => Number(value!.replace(/\Rp\s?|(\.)/g, ""))}
          value={propertyPrice}
          onChange={(value) => onPropertyPriceChange(value || 0)}
        />
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
          value={downPayment}
          // min={minDownPayment}
          max={propertyPrice}
          status={!isDownPaymentValid ? "error" : ""}
          onChange={(value) => onDownPaymentChange(value || 0)}
        />

        {!isDownPaymentValid && (
          <div className="text-red-500 text-sm">
            Uang muka minimal 10% (Rp {minDownPayment.toLocaleString("id-ID")})
            dan maksimal 80% dari harga properti
          </div>
        )}
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Jangka Waktu (Tenor)</p>

        <Row align="middle" gutter={16}>
          <Col flex="auto">
            <Slider min={5} max={30} value={tenor} onChange={onTenorChange} />
          </Col>

          <Col>
            <InputNumber
              size="large"
              controls={false}
              className="!w-[90px]"
              min={1}
              max={30}
              value={tenor}
              onChange={(value) => onTenorChange(value || 5)}
              suffix={<p className="font-semibold text-dark-tosca">tahun</p>}
            />
          </Col>
        </Row>
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="font-semibold text-dark-tosca">Pilihan Suku Bunga</p>

        <Select
          placeholder="Pilih suku bunga"
          className="w-full"
          popupMatchSelectWidth={false}
          size="large"
          value={selectedRate?.id}
          onChange={(value) => {
            const rate = interestRateData.find(
              (r) => r.id === value
            ) as InterestRate;
            onRateChange(rate || null);
          }}
          options={interestRateData.map((rate) => ({
            key: rate.id,
            value: rate.id,
            label: rate.title,
          }))}
          status={!isValidTenor ? "error" : ""}
        />

        {!isValidTenor && (
          <div className="text-red-500 text-sm ">
            Tenor minimal untuk suku bunga ini adalah{" "}
            {selectedRate?.minimum_tenor} tahun
          </div>
        )}
      </div>
    </div>
  );
};
