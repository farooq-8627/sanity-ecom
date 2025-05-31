import { ProductReel } from "@/types/ProductReel";

interface ReelCommentsProps {
  comments: ProductReel['comments'];
}

export default function ReelComments({ comments }: ReelCommentsProps) {
  return (
    <div className="bg-white rounded-lg p-4 h-[300px] overflow-y-auto">
      <h3 className="font-medium mb-4">Comments</h3>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment._id} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">{comment.user.name}</p>
              <p className="text-sm text-gray-600">{comment.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {(!comments || comments.length === 0) && (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}
      </div>
    </div>
  );
} 