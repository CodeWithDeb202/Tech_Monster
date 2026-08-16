import './Button.css';

export default function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button className={`lesson-button lesson-button--${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}
