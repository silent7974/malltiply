export default function Page() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 px-6 text-center">
      <h1 className="text-[18px] font-semibold text-black mb-2">
        Categories
      </h1>

      <p className="text-[14px] text-black/60 max-w-[260px]">
        Use the search bar to find products.
        Categories will appear here as the catalog grows.
      </p>
    </div>
  );
}