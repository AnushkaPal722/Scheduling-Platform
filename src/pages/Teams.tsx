import FeatureGate from '../components/FeatureGate';

export default function Teams() {
  return (
    <FeatureGate 
      badge="Teams"
      headline="Automatically route meetings to your team"
      description="Turn individual scheduling into a system that assigns, distributes, and manages meetings for our team."
      benefits={[
        "Route inbound requests to the right person",
        "Distribute meetings fairly with round-robin",
        "See what's getting booked (and what's not)",
        "Remove Cal.com branding"
      ]}
    />
  );
}
