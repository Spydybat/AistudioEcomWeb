import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-32 text-center w-full px-4">
      <h1 className="text-[8rem] sm:text-[12rem] font-serif font-bold text-neutral-100 leading-none mb-4 select-none">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-sans tracking-tight mb-4">
        Page Not Found
      </h2>
      <p className="text-neutral-500 mb-10 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-neutral-100 pl-12 pr-4 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
          />
        </div>
        <Link 
          to="/"
          className="w-full sm:w-auto shrink-0 bg-black text-white px-8 py-4 rounded-full text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors text-center"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
