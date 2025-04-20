import { useState } from "react";
import { CertificatePicker } from "./CertificatePicker";

export function MintBNOTE() {
  const [totalCertificates, setTotalCertificates] = useState(0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="md:col-span-2">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-primary pb-3 border-b border-gray-200 mb-4">
            About Bittrees Certificates
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Bittrees Research certificates represent...lorem ipsum dolor sit
            amet. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed.
          </p>
          <CertificatePicker
            totalCertificates={totalCertificates}
            onCertificatesChange={(certs: number) => {
              setTotalCertificates(certs);
            }}
          />
          <div className="mb-6">
            <label className="block text-lg font-semibold text-primary mb-3">
              Select Payment Token
            </label>

            <div className="grid grid-cols-3 gap-3">
              {/* <div className="border-2 border-secondary bg-secondary/10 rounded-md p-3 flex items-center gap-2 cursor-pointer">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
                  W
                </div>
                <div className="font-semibold">WBTC</div>
              </div> */}

              <div className="border-2 border-gray-200 rounded-md p-3 flex items-center gap-2 cursor-pointer hover:border-secondary transition-colors">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
                  BT
                </div>
                <div className="font-semibold">BTREE</div>
              </div>

              {/* <div className="border-2 border-gray-200 rounded-md p-3 flex items-center gap-2 cursor-pointer hover:border-secondary transition-colors">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
                  U
                </div>
                <div className="font-semibold">USDC</div>
              </div> */}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <div className="flex justify-between mb-2">
              <div>Price (25 certificates):</div>
              <div>0.296 ETH</div>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 mt-3">
              <div>Total:</div>
              <div>0.296 ETH</div>
            </div>
          </div>
          <button
            className="border w-full bg-secondary hover:bg-secondary/90 font-semibold text-lg py-4 px-6 rounded-md transition-all hover:-translate-y-0.5"
            onClick={() => {}}
          >
            Mint
          </button>
        </div>
      </div>
    </div>
  );
}
