import { convertCertificatesToDenominations } from "../lib/certificate-math";
export function CertificatePicker() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="bg-secondary/10 border-l-4 border-secondary p-4 rounded-r-lg mb-6">
        <p className="text-gray-800">
          Our system will automatically determine the optimal combination of
          certificate denominations (1, 10, and 100) based on the quantity you
          select.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-primary mb-3">
          Choose Quantity
        </label>

        <div className="space-y-4">
          <div className="space-y-2">
            {/* <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    value="25"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-center min-w-20 h-10 bg-white border-2 border-gray-200 rounded-md font-semibold text-lg">
                    25
                  </div>
                </div> */}

            {/* <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 transition-colors">
                10
              </button>
              <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 transition-colors">
                25
              </button>
              <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 transition-colors">
                50
              </button>
              <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 transition-colors">
                100
              </button>
              <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 transition-colors">
                250
              </button>
            </div> */}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="font-semibold text-gray-700">
              Or enter exact amount:
            </div>
            <div className="w-full sm:w-auto flex-grow">
              <input
                type="number"
                min="1"
                max="10000"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                onChange={(v) => {
                  console.log(
                    "Denominations:",
                    convertCertificatesToDenominations(
                      parseInt(v.target.value, 10)
                    )
                  );
                }}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
            For your selected quantity of 25 certificates, our system will mint:
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200 text-xs text-primary">
                2 × 10 certificates
              </div>
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200 text-xs text-primary">
                5 × 1 certificates
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
