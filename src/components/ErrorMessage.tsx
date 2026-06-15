type ErrorMessageProps = {
  message: string;
  onBack?: () => void;
  onRetry?: () => void;
  fullScreen?: boolean;
};

export default function ErrorMessage({ message, onBack, onRetry, fullScreen = false }: ErrorMessageProps) {
  const iconSize = fullScreen ? "w-12 h-12" : "w-10 h-10";
  const svgSize = fullScreen ? "w-6 h-6" : "w-5 h-5";

  return (
    <div
      className={`flex flex-col items-center gap-3 text-center ${
        fullScreen ? "min-h-screen justify-center gap-4" : "mt-16"
      }`}
    >
      <div className={`${iconSize} bg-red-500/10 rounded-full flex items-center justify-center`}>
        <svg className={`${svgSize} text-red-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
        </svg>
      </div>
      <p className="text-red-400 text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
          Try again
        </button>
      )}
      {onBack && (
        <button onClick={onBack} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
          Go back
        </button>
      )}
    </div>
  );
}
