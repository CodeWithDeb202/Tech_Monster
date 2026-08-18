import './NotePoint.css';

export default function NotePoint({ points = [] }) {
  if (!Array.isArray(points) || points.length === 0) return null;

  return (
    <ul className="lesson-note-point">
      {points.map((point, index) => (
        <li key={`${point}-${index}`}>{point}</li>
      ))}
    </ul>
  );
}
