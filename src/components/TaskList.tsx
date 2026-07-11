import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onToggleTask: (id: number) => void;
};

function TaskList({ tasks, onDeleteTask, onToggleTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDeleteTask={onDeleteTask}
          onToggleTask={onToggleTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
