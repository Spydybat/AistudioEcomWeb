import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-32 text-center w-full px-4 bg-white">
      <h1 className="text-[8rem] sm:text-[12rem] font-sans font-bold tracking-tighter text-zinc-100 leading-none mb-4 select-none">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-black uppercase mb-4">
        Page Not Found
      </h2>
      <p className="text-zinc-500 font-medium mb-10 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-zinc-50 border border-zinc-200 text-black font-medium pl-12 pr-4 py-4 rounded-full focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <Link 
          to="/"
          className="w-full sm:w-auto shrink-0 bg-black text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors text-center shadow-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
