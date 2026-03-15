export default function Spinner({ color = "black" }) {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <div
        className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: color, borderTopColor: "transparent" }}
      />
    </div>
  )
}