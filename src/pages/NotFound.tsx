import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-slate-600 text-8xl font-bold">404</p>
      <p className="text-white font-semibold text-lg">Page not found</p>
      <p className="text-slate-500 text-sm">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
      >
        Go back home
      </button>
    </div>
  );
}

export default NotFound;
