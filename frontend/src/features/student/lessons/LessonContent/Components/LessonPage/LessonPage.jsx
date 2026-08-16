import "./LessonPage.css";

import Heading from "./Components/Heading";
import SubHeading from "./Components/SubHeading";
import Paragraph from "./Components/Paragraph";
import CodeBlock from "./Components/CodeBlock";
import NotePoint from "./Components/NotePoint";
import Lists from "./Components/Lists";
import Table from "./Components/Table";
import OutputPreview from "./Components/OutputPreview";
import Button from "./Components/Button";

export default function LessonPage({ lesson }) {
  // `lesson` is the normalized section. The raw lesson body (notes, tasks, etc.)
  // lives on `lesson.lesson`. Fall back gracefully either way.
  const rawLesson = lesson?.lesson || lesson || {};
  const notes = rawLesson?.notes ? [rawLesson.notes] : [];

  const renderNotes = () => {
    if (!notes.length) {
      return <Paragraph text="No lesson content is available for this course yet." />;
    }

    return notes.map((note, index) => (
      <section className="lesson-section" key={`${note?.heading || "note"}-${index}`}>
        <Heading title={note?.heading || lesson?.heading} />
        <SubHeading text={note?.subHeading || note?.heading || lesson?.heading} />
        <Paragraph text={note?.paragraph || note?.overview || lesson?.paragraph} />

        {note?.importantNotesPoint?.length ? (
          <NotePoint points={note.importantNotesPoint} />
        ) : null}

        {note?.keyPoints?.length ? (
          <Lists items={note.keyPoints} title="Key Points" />
        ) : null}

        {note?.demoCode ? (
          <CodeBlock code={note.demoCode} language={note.codeLanguage || "javascript"} />
        ) : null}

        {note?.tableData ? <Table data={note.tableData} /> : null}
        {note?.expectedOutput || note?.output ? (
          <OutputPreview output={note.expectedOutput || note.output} />
        ) : null}

        {note?.actionButtons?.length ? (
          <div className="lesson-actions">
            {note.actionButtons.map((button, btnIndex) => (
              <Button
                key={`${button.label}-${btnIndex}`}
                label={button.label}
                variant={btnIndex === 0 ? "primary" : "secondary"}
              />
            ))}
          </div>
        ) : null}
      </section>
    ));
  };

  return (
    <div id="lesson-page">
      {renderNotes()}
    </div>
  );
}
