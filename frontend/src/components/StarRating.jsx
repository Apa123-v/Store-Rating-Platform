const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => setRating(star)}
          className={`text-2xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } ${editable ? "hover:scale-110 transition-transform" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;