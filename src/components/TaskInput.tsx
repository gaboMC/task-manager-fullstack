import { useState, FormEvent } from "react";

type TaskInputProps = {
  onAddTask: (text: string) => void;
};

function TaskInput({ onAddTask }: TaskInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); // Previene la recarga de página nativa
    if (text.trim() === "") return;

    onAddTask(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Escribe una nueva tarea..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="task-input"
      />
      <button type="submit" className="add-btn">Add</button>
    </form>
  );
}

export default TaskInput;
