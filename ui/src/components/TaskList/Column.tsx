import { FC, ComponentProps } from 'react';
import { ColumnData } from '../../types';
import { Droppable } from 'react-beautiful-dnd';
import { TaskItem } from './TaskItem';
import { TaskList } from '.';

type Props = {
  col: ColumnData;
} & Omit<ComponentProps<typeof TaskList>, 'tasks' | 'onUpdateTaskStatus'>;

export const Column: FC<Props> = ({ col, onEditTask, onRemoveTask, isTaskPending }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-xl">{col.label}</h2>
      <Droppable droppableId={col.id}>
        {(provided) => (
          <div
            className="rounded-lg bg-gray-300 grow p-4 overflow-y-auto max-h-[60vh] flex flex-col"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {col.list.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                onEditTask={onEditTask}
                onRemoveTask={onRemoveTask}
                className="my-1"
                isTaskPending={isTaskPending}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
