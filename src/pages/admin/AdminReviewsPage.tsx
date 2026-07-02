import { useState, useMemo, useEffect } from "react";
import { Search, Star, Eye, X, MessageSquare } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { supabase } from "../../supabaseClient";

const statusColors: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
  hidden: "bg-neutral-500/10 text-zinc-500 border border-neutral-500/20",
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  useEffect(() => {
    fetchReviewsFromSupabase();
  }, []);

  const fetchReviewsFromSupabase = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*, products(name), profiles(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else if (data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedReview) return;
    const { error } = await supabase
      .from("reviews")
      .update({ status: newStatus })
      .eq("id", selectedReview.id);

    if (!error) {
      setReviews(
        reviews.map((r) =>
          r.id === selectedReview.id ? { ...r, status: newStatus } : r
        )
      );
      setSelectedReview({ ...selectedReview, status: newStatus });
    } else {
      console.error("Error updating status:", error);
    }
  };

  const filtered = useMemo(() => {
    let result = reviews;

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (ratingFilter !== "all") {
      result = result.filter((r) => r.rating === parseInt(ratingFilter));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.products?.name?.toLowerCase().includes(q) ||
          r.profiles?.full_name?.toLowerCase().includes(q) ||
          r.profiles?.email?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, statusFilter, ratingFilter, reviews]);

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black">
          Reviews
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          {reviews.length} total reviews
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or product..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-indigo-500 placeholder-zinc-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-white border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-500 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <div className="flex bg-white border border-zinc-200 rounded-lg p-1">
            {["all", "published", "pending", "hidden"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
                  statusFilter === status
                    ? "bg-zinc-200 text-black font-medium"
                    : "text-zinc-500 hover:text-zinc-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
          <p className="text-zinc-500">No reviews found.</p>
        </div>
      ) : (
        <DataTable
          headers={[
            "Product",
            "Customer",
            "Rating",
            "Comment",
            "Date",
            "Status",
            "Actions",
          ]}
        >
          {filtered.map((review) => (
            <tr
              key={review.id}
              className="hover:bg-zinc-100 transition-colors"
            >
              <td className="px-4 sm:px-6 py-3 text-sm text-black max-w-[180px] truncate">
                {review.products?.name || "Unknown Product"}
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-500 text-sm">
                {review.profiles?.full_name || "Unknown Customer"}
              </td>
              <td className="px-4 sm:px-6 py-3">
                <RatingStars rating={review.rating} />
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-500 text-xs max-w-[200px] truncate">
                {review.comment}
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-500 text-xs">
                {new Date(review.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 sm:px-6 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                    statusColors[review.status] || statusColors.pending
                  }`}
                >
                  {review.status || "pending"}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-3">
                <button
                  onClick={() => setSelectedReview(review)}
                  className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="bg-white border border-zinc-300 rounded-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-200 bg-zinc-50">
              <div>
                <h3 className="text-xl font-serif font-bold text-black">
                  Review Details
                </h3>
                <p className="text-zinc-500 text-sm mt-1">
                  {selectedReview.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-100 rounded-lg p-4 border border-zinc-200">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-medium text-black">
                    {selectedReview.profiles?.full_name || "Unknown"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {selectedReview.profiles?.email || "No email"}
                  </p>
                </div>
                <div className="bg-zinc-100 rounded-lg p-4 border border-zinc-200">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">
                    Product
                  </p>
                  <p className="text-sm font-medium text-black">
                    {selectedReview.products?.name || "Unknown"}
                  </p>
                  <div className="mt-2">
                    <RatingStars rating={selectedReview.rating} />
                  </div>
                </div>
                <div className="bg-zinc-100 rounded-lg p-4 border border-zinc-200">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">
                    Date
                  </p>
                  <p className="text-sm font-medium text-black">
                    {new Date(selectedReview.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="bg-zinc-100 rounded-lg p-4 border border-zinc-200">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">
                    Status Actions
                  </p>
                  <select
                    value={selectedReview.status || "pending"}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-1.5 text-sm text-black focus:outline-none focus:border-indigo-500"
                  >
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-widest font-mono text-zinc-500 mb-2">
                  Review Content
                </h4>
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4 text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedReview.comment || "No comment provided."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
