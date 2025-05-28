export default function Technology() {
  const technologies = [
    {
      title: "3D Geometry Analysis",
      description:
        "Extracts 3D patches within detected regions to refine defect geometry. This allows for accurate measurement of pothole depth, area, and crack dimensions.",
      features: [
        "Depth Measurement",
        "Area Calculation",
        "Crack Dimension Analysis",
      ],
    },
    {
      title: "Advanced Sensor Fusion",
      description:
        "Integrates RGB and depth images from stereo cameras and LiDAR. This fusion provides 3D cues, enhancing robustness and accuracy in diverse conditions.",
      features: [
        "RGB Camera Integration",
        "LiDAR Point Cloud Processing",
        "Multi-sensor Data Fusion",
      ],
    },
    {
      title: "Hybrid Deep Learning Models",
      description:
        "Combines lightweight detectors for real-time candidate region proposal with high-accuracy semantic segmentation networks for pixel-level defect identification.",
      features: [
        "Real-time Detection",
        "Semantic Segmentation",
        "Edge-optimized Inference",
      ],
    },
    {
      title: "Automated Severity Assessment",
      description:
        "Translates geometric measurements into quantitative metrics (e.g., IRI/PCI alignment) for objective road quality scoring, enabling prioritized maintenance.",
      features: [
        "IRI/PCI Alignment",
        "Quantitative Scoring",
        "Prioritization Algorithms",
      ],
    },
  ];

  return (
    <section id="technology" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Advanced Technology
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our solution leverages cutting-edge technologies to deliver accurate
            and reliable results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {tech.title}
              </h3>
              <p className="text-gray-600 mb-4">{tech.description}</p>{" "}
              <div className="bg-teal-50 p-4 rounded-lg">
                {tech.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center space-x-2 mb-2 last:mb-0"
                  >
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
                    <span className="text-[#229799] font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
