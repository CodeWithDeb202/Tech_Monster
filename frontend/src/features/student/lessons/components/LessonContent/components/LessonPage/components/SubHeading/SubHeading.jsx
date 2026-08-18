import './SubHeading.css';

export default function SubHeading({ text }) {
  if (!text) return null;

  return <h3 className="lesson-subheading">{text}</h3>;
}
