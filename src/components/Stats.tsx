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
    <section className="py-12 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-teal-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
            The Road Safety Crisis
          </h2>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Path Guardian addresses a severe and costly challenge impacting
            India&apos;s infrastructure and public safety.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/90 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:border-gray-300/50 transition-all duration-300  hover:scale-105"
            >
              <div
                className={`${stat.color} text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 group-hover:scale-105 transition-transform duration-300`}
              >
                {stat.number}
              </div>
              <div className="text-gray-800 font-semibold text-lg md:text-xl mb-3 md:mb-4">
                {stat.label}
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
