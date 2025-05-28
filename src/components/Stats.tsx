export default function Stats() {
  const stats = [
    {
      number: "2,300+",
      label: "Annual Fatalities",
      description:
        "In India due to pothole-related road crashes, highlighting a major public safety crisis.",
      color: "text-red-600",
    },
    {
      number: "₹10k - ₹30k",
      label: "Vehicle Repair Costs",
      description:
        "Per incident from pothole damage, a significant financial burden often paid out-of-pocket.",
      color: "text-amber-600",
    },
    {
      number: "6.6M+ km",
      label: "Total Road Network",
      description:
        "India's extensive road infrastructure requiring constant monitoring and maintenance.",
      color: "text-[#229799]",
    },
    {
      number: "₹50k Cr+",
      label: "Annual Repair Budget",
      description:
        "Across municipalities, often inefficiently allocated due to reactive maintenance approaches.",
      color: "text-green-600",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            The Road Safety Crisis
          </h2>{" "}
          <p className="text-gray-600 max-w-2xl mx-auto">
            Path Guardian addresses a severe and costly challenge impacting
            India&apos;s infrastructure and public safety.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow transform hover:scale-105"
            >
              <div className={`${stat.color} text-4xl font-bold mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-800 font-medium mb-2">{stat.label}</div>
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
