import { Users, Package, Handshake, Leaf } from "lucide-react";

export default function CommunityImpact() {
  const impactData = [
    {
      id: 1,
      icon: <Users className="w-8 h-8 text-green-500" />,
      number: "1,234",
      title: "Community Members",
      description: "Active users sharing items",
    },
    {
      id: 2,
      icon: <Package className="w-8 h-8 text-green-500" />,
      number: "2,567",
      title: "Items Shared",
      description: "Free & low-cost items available",
    },
    {
      id: 3,
      icon: <Handshake className="w-8 h-8 text-green-500" />,
      number: "3,891",
      title: "Successful Exchanges",
      description: "Items successfully shared",
    },
    {
      id: 4,
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      number: "15.2K",
      title: "Pounds Saved",
      description: "Waste diverted from landfills",
    },
  ];

  return (
    <section className="px-6 md:px-20 py-12 bg-gray-900">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white">
          Our Community Impact
        </h2>
        <p className="text-gray-300 mt-2">
          Together, we're building a more sustainable future by sharing resources and reducing waste.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {impactData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-2xl font-bold text-white">
              {item.number}
            </h3>
            <h4 className="text-lg font-semibold text-gray-300 mt-1">
              {item.title}
            </h4>
            <p className="text-gray-400 text-center mt-1 text-sm">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
