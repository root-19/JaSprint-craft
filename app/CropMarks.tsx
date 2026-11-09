/** Printer's crop marks on the four corners of a `relative` parent. */
export default function CropMarks({ className = "text-white/40" }: { className?: string }) {
  return (
    <span aria-hidden className={className}>
      <span className="crop crop-tl" />
      <span className="crop crop-tr" />
      <span className="crop crop-bl" />
      <span className="crop crop-br" />
    </span>
  );
}
