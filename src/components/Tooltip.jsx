export default function Tooltip({ label, text }) {
  return (
    <span className="hint-wrap">
      {label}
      <span className="hint-icon">?</span>
      <span className="hint-popup">{text}</span>
    </span>
  )
}
