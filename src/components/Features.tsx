export default function Features() {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-[#229799]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
      title: "AI-Powered Detection",
      description:
        "Utilizes deep learning and computer vision for instant road surface analysis and damage-severity assessment.",
      bgColor: "bg-teal-100",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
      title: "Dynamic Mapping",
      description:
        "Maps precise GPS locations of defects, feeding into a centralized dashboard for authorities to visualize and prioritize repairs.",
      bgColor: "bg-green-100",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      title: "Smart Routing",
      description:
        "Generates optimized routes to avoid damaged roads, improving commuter safety and reducing vehicle wear.",
      bgColor: "bg-amber-100",
    },
  ];
  return (
    <section
      id="features"
      className="py-12 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-teal-50"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
            Solution & Innovation
          </h2>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Our comprehensive approach combines cutting-edge technology with
            practical solutions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/90 backdrop-blur-sm p-8 md:p-10 lg:p-12 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:border-gray-300/50 transition-all duration-300  hover:scale-105"
            >
              <div
                className={`${feature.bgColor} p-4 md:p-5 rounded-2xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-md`}
              >
                <div className="scale-110 md:scale-125">{feature.icon}</div>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-800 mb-4 md:mb-6 group-hover:text-[#229799] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
