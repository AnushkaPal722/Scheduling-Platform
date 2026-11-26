import FeatureGate from '../components/FeatureGate';

export default function Insights() {
  return (
    <FeatureGate 
      badge="Insights"
      headline="See what's getting booked, and what's not"
      description="Turn booking data into clarity for you and your team so you can spot gaps, balance workload, and make better scheduling decisions."
      benefits={[
        "Understand booking volume and cancellations",
        "See how meetings are distributed across team members",
        "Spot trends that help you improve availability and routing"
      ]}
    />
  );
}
