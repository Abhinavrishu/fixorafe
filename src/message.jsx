export default function Message({ from, text, fileName }) {
  return (
    <div className={`message ${from}`}>
      <span>{text}</span>
      {fileName && <div className="file-name">{fileName}</div>}
    </div>
  );
}
