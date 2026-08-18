import './CodeBlock.css';

export default function CodeBlock({ code, language = 'javascript' }) {
  if (!code) return null;

  return (
    <div className="lesson-codeblock">
      <div className="lesson-codeblock__header">{language}</div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
