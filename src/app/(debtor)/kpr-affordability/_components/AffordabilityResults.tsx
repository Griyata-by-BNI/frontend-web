import { Alert, Button, Col, Divider, Row, theme } from "antd";
import interestRateData from "@/data/interest-rate.json";
import { AffordabilityParams } from "../_types";
import { useRouter } from "next/navigation";
import TermsAndConditionsModal from "@/components/TermsAndConditionsModal";
import { useState } from "react";

const { useToken } = theme;

interface AffordabilityResultsProps {
  params: AffordabilityParams;
  affordablePrice: number;
  isAffordable: boolean;
}

export const AffordabilityResults = ({
  params,
  affordablePrice,
  isAffordable,
}: AffordabilityResultsProps) => {
  const { token } = useToken();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const netIncome = params.monthlyIncome - params.monthlyExpenses;

  const affordabilityRatio =
    params.monthlyInstallment > 0
      ? (params.monthlyInstallment / netIncome) * 100
      : 0;

  const selectedRate = interestRateData.find(
    (rate) => rate.id === params.selectedRateId
  );

  const isValidTenor =
    !selectedRate || params.tenor >= selectedRate.minimum_tenor;

  return (
    <div className="p-4 md:p-6 rounded-lg bg-light-tosca h-max w-full">
      <div className="space-y-4">
        <p className="text-primary-black text-lg font-bold">
          Kemampuan KPR yang cocok untukmu
        </p>

        {!isValidTenor && selectedRate ? (
          <Alert
            message={
              <p style={{ color: token.colorError }} className="font-bold">
                Tenor Tidak Sesuai
              </p>
            }
            description={`Tenor minimal untuk suku bunga yang dipilih adalah ${selectedRate.minimum_tenor} tahun. Silakan pilih tenor minimal ${selectedRate.minimum_tenor} tahun atau pilih suku bunga lain.`}
            type="error"
            showIcon
          />
        ) : isAffordable ? (
          <Row gutter={[4, 12]}>
            <Col span={24}>
              <p className="text-sm text-gray-600">Penghasilan Bersih</p>

              <p className="text-primary-tosca text-lg font-bold">
                Rp {netIncome.toLocaleString("id-ID")}
              </p>
            </Col>

            <Col span={24}>
              <p className="text-sm text-gray-600">Rasio Angsuran</p>

              <p className="text-lg font-bold text-primary-tosca">
                {affordabilityRatio.toFixed(1)}% dari penghasilan bersih
              </p>
            </Col>

            <Col span={24}>
              <p className="text-sm text-gray-600">Harga Rumah yang Cocok</p>
              <p className="text-2xl font-bold text-primary-tosca">
                Rp {affordablePrice.toLocaleString("id-ID")}
              </p>
            </Col>

            <Col span={24}>
              <Divider className="!mt-2" />

              <Button
                type="primary"
                className="w-full"
                onClick={() =>
                  router.push(
                    `/search?priceMax=${affordablePrice}&priceMin=0&sortBy=highestPrice`
                  )
                }
              >
                Cari Properti
              </Button>

              <p
                className="text-sm text-dark-tosca/75 underline text-center mt-4 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                Syarat & Ketentuan
              </p>

              <TermsAndConditionsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </Col>
          </Row>
        ) : (
          <Alert
            message={
              <p style={{ color: token.colorWarning }} className="font-bold">
                Kemampuan KPR Tidak Mencukupi
              </p>
            }
            description="Angsuran yang diinginkan melebihi kemampuan finansial Anda. Pertimbangkan untuk mengurangi angsuran atau meningkatkan penghasilan."
            type="warning"
            showIcon
          />
        )}
      </div>
    </div>
  );
};
