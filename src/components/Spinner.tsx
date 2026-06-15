type SpinnerProps = {
  fullScreen?: boolean;
  size?: "sm" | "md";
};

export default function Spinner({ fullScreen = false, size = "md" }: SpinnerProps) {
  const ring = (
    <div
      className={`border-2 border-blue-500 border-t-transparent rounded-full animate-spin ${
        size === "sm" ? "w-7 h-7" : "w-8 h-8"
      }`}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">{ring}</div>
    );
  }

  return <div className="flex justify-center mt-24">{ring}</div>;
}
