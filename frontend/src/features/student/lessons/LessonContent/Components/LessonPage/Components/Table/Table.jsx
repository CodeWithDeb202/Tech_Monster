import './Table.css';

export default function Table({ data }) {
  if (!data || !Array.isArray(data.rows) || data.rows.length === 0) return null;

  return (
    <div className="lesson-table-wrapper">
      {data.title ? <h4 className="lesson-table-title">{data.title}</h4> : null}
      <table className="lesson-table">
        <thead>
          <tr>
            {(data.headers || []).map((header, index) => (
              <th key={`${header}-${index}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
