import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const HeroBanner = () => {
  return (
    <Card className="bg-accent px-3 py-2 rounded-2xl ">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-accent-foreground mb-4">
            <p>Get best online</p>
            <p className="text-blue-500 ">Treatment at home</p>
          </h2>
          <p className="text-gray-400 mb-6 max-w-md text-sm">
            We provide best care and response for your health needs.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
          >
            Book Now
          </Button>
        </div>
        <div className="flex-shrink-0 ">
          <img
            src="/pictures/Doctors-animate.svg"
            alt="Professional African Doctor"
            className="w-full h-60 object-cover rounded-xl"
          />
        </div>
      </div>
    </Card>
  );
};

export default HeroBanner;
