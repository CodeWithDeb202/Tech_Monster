import './Heading.css';

export default function Heading({ title }) {
  if (!title) return null;

  return <h2 className="lesson-heading">{title}</h2>;
}
