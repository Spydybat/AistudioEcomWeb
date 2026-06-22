import { useState, useMemo } from "react";
import { Star } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { REVIEWS } from "../../data/adminData";

const statusColors: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  hidden: "bg-neutral-100 text-neutral-500",
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return REVIEWS;
    return REVIEWS.filter((r) => r.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">Reviews</h1>
        <p className="text-neutral-500 text-sm mt-1">{REVIEWS.length} customer reviews</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "published", "pending", "hidden"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-900"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <DataTable headers={["Product", "Customer", "Rating", "Comment", "Date", "Status"]}>
        {filtered.map((review) => (
          <tr key={review.id} className="hover:bg-neutral-50">
            <td className="px-4 sm:px-6 py-3 text-sm text-neutral-900 max-w-[180px] line-clamp-2">
              {review.productName}
            </td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600">{review.customerName}</td>
            <td className="px-4 sm:px-6 py-3">
              <RatingStars rating={review.rating} />
            </td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600 text-xs max-w-[200px] line-clamp-2">
              {review.comment}
            </td>
            <td className="px-4 sm:px-6 py-3 text-neutral-500 text-xs">{review.date}</td>
            <td className="px-4 sm:px-6 py-3">
              <span className={`px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${statusColors[review.status]}`}>
                {review.status}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
