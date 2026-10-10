export default function GradientWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 to-pink-200 p-8">
      {children}
    </div>
  );
}
