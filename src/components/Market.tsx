export default function Market() {
  const marketData = [
    {
      title: "Current Market Size",
      value: "₹2.1 Lakh Cr",
      description: "Annual road construction and maintenance budget in India",
      trend: "+12% YoY",
    },
    {
      title: "Target Addressable Market",
      value: "₹25k Cr+",
      description:
        "Annual pothole-related damage costs and inefficient maintenance spending",
      trend: "Growing",
    },
    {
      title: "Immediate Opportunity",
      value: "500+ Cities",
      description:
        "Tier-1 and Tier-2 cities requiring smart infrastructure solutions",
      trend: "Ready to deploy",
    },
  ];

  const opportunities = [
    "Government Smart City initiatives creating demand for intelligent infrastructure",
    "Increasing vehicle ownership driving need for better road quality",
    "Rising insurance claims from pothole damage creating market urgency",
    "Digital India push supporting technology adoption in public services",
  ];

  return (
    <section
      id="market"
      className="py-16 px-4 bg-gradient-to-br from-teal-50 to-emerald-100"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Market Opportunity
          </h2>{" "}
          <p className="text-gray-600 max-w-2xl mx-auto">
            Path Guardian addresses a massive and growing market need in
            India&apos;s rapidly expanding infrastructure sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {marketData.map((data, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            >
              {" "}
              <div className="text-3xl font-bold text-[#229799] mb-2">
                {data.value}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-2">
                {data.title}
              </div>
              <p className="text-gray-600 text-sm mb-2">{data.description}</p>
              <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                {data.trend}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Key Market Drivers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start space-x-3">
                {" "}
                <div className="bg-teal-100 p-2 rounded-full flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#229799]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
