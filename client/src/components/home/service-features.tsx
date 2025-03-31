import { Ticket, CreditCard, Tags, Headphones } from "lucide-react";

type FeatureProps = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-neutral-600">{description}</p>
  </div>
);

export default function ServiceFeatures() {
  const features = [
    {
      icon: <Ticket className="h-6 w-6" />,
      title: "Easy Booking",
      description: "Book your tickets in just a few clicks with our simple, intuitive interface."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Multiple payment options with secure processing and instant confirmation."
    },
    {
      icon: <Tags className="h-6 w-6" />,
      title: "Best Prices",
      description: "Competitive pricing with regular promotions and loyalty rewards."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Our customer service team is always ready to assist you with any queries."
    }
  ];

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Choose RailConnect</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
