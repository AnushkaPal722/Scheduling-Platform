import FeatureGate from '../components/FeatureGate';

export default function Routing() {
  return (
    <FeatureGate 
      badge="Routing"
      headline="Route bookings to the right team member automatically"
      description="Use routing rules to qualify bookers and assign meetings to the best team member."
    />
  );
}
