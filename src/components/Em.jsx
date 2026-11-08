export default function Em({ children, tone = "gold", className = "" }) {
  const color = tone === "white" ? "text-white" : "text-amber-300";
  return (
    <em
      className={`font-serif font-bold italic tracking-normal text-[1.06em] ${color} ${className}`}
    >
      {children}
    </em>
  );
}