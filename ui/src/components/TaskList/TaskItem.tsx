import { FC, MouseEvent, ComponentProps } from 'react';
import { Task, TaskStatus } from '../../types';
import { Draggable } from 'react-beautiful-dnd';
import cn from 'classnames';
import { Button, Checkbox } from '..';
import { Download, Edit, Trash } from '../../icons';
import { TaskList } from '.';

type Props = {
  task: Task;
  index: number;
  className?: string;
  onEditTask: (event: MouseEvent<HTMLButtonElement>, task: Task) => void;
} & Omit<ComponentProps<typeof TaskList>, 'tasks' | 'onUpdateTaskStatus'>;

export const TaskItem: FC<Props> = ({
  task,
  index,
  className = '',
  onEditTask,
  onRemoveTask,
  isTaskPending,
}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={cn(
            'rounded-md p-3 bg-gray-50 transition-opacity',
            {
              'cursor-grab': !isTaskPending,
              'cursor-not-allowed opacity-50 pointer-events-none':
                isTaskPending,
            },
            className
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-4 items-center">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={(event) => {
                    onEditTask(event, task);
                  }}
                >
                  <Edit width={16} height={16} />
                </Button>

                {task.filePath && (
                  <Button
                    href={`${import.meta.env.VITE_API_URL}/files/${task.id}`}
                    variant="secondary"
                    type="button"
                  >
                    <Download width={16} height={16} />
                  </Button>
                )}

                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => onRemoveTask(task.id)}
                >
                  <Trash width={16} height={16} />
                </Button>
              </div>

              <Checkbox isChecked={task.status === TaskStatus.Completed} />
            </div>

            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p>{task.description}</p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
