import { FC, useState, useCallback, useEffect, MouseEvent } from 'react';
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd';
import { Columns, Task, TaskStatusKey } from '../../types';
import { Column } from './Column';
import { mapTasksToColumns } from '../../utils';

type Props = {
  tasks: Task[];
  onEditTask: (event: MouseEvent<HTMLButtonElement>, task: Task) => void;
  onRemoveTask: (taskId: string) => Promise<void>;
  onUpdateTaskStatus: (
    task: Task,
    newStatus: TaskStatusKey
  ) => Promise<void>;
  isTaskPending: boolean
};

export const TaskList: FC<Props> = ({
  tasks,
  onEditTask,
  onRemoveTask,
  onUpdateTaskStatus,
  isTaskPending,
}) => {
  const [columns, setColumns] = useState<Columns | null>(null);

  useEffect(() => {
    setColumns(mapTasksToColumns(tasks));
  }, [tasks]);

  const onDragEnd: OnDragEndResponder = useCallback(
    async ({ destination, source, draggableId }) => {
      if (!destination || !destination || !columns) return;

      if (
        source.droppableId === destination.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const start = columns[source.droppableId as TaskStatusKey];
      const end = columns[destination.droppableId as TaskStatusKey];

      if (start.id === end.id) {
        const newList = start.list.filter(
          (_, idx: number) => idx !== source.index
        );

        newList.splice(destination.index, 0, start.list[source.index]);

        const newCol = {
          id: start.id,
          list: newList,
          label: start.label,
        };

        setColumns((prev) => ({
          ...(prev as Columns),
          [newCol.id]: newCol,
        }));
      } else {
        const newStartList = start.list.filter(
          (_, idx: number) => idx !== source.index
        );

        const newStartCol = {
          id: start.id,
          list: newStartList,
          label: start.label,
        };

        const newEndList = end.list;

        newEndList.splice(destination.index, 0, start.list[source.index]);

        const newEndCol = {
          id: end.id,
          list: newEndList,
          label: end.label,
        };

        setColumns((prev) => ({
          ...(prev as Columns),
          [newStartCol.id]: newStartCol,
          [newEndCol.id]: newEndCol,
        }));
      }

      if (destination.droppableId !== source.droppableId) {
        const task = tasks.find(({ id }) => id === draggableId) as Task;

        await onUpdateTaskStatus(
          task,
          destination.droppableId as TaskStatusKey
        );
      }
    },
    [columns, tasks, onUpdateTaskStatus]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 h-[60vh] gap-4 w-4/5">
        {Object.values(columns ?? {}).map((col) => (
          <Column
            key={col.id}
            col={col}
            onEditTask={onEditTask}
            onRemoveTask={onRemoveTask}
            isTaskPending={isTaskPending}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
