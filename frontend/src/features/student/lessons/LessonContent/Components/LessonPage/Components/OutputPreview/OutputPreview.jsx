import './OutputPreview.css';

export default function OutputPreview({ output }) {
  if (!output) return null;

  return (
    <div className="lesson-output-preview">
      <h4>Expected Output</h4>
      <pre>{output}</pre>
    </div>
  );
}
