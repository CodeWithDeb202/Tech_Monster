import './List.css';

export default function Lists({ items = [], title = 'Key Points' }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="lesson-list-block">
      {title ? <h4 className="lesson-list-title">{title}</h4> : null}
      <ul className="lesson-list">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="lesson-list-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
