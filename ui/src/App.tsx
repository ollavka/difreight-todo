import { useState, MouseEvent, useCallback, useEffect, FormEvent } from 'react';
import { Button, Loader, TaskModal } from './components';
import { Task, TaskStatusKey } from './types';
import * as taskService from './service/taskService';
import { useFetch } from './hooks';
import { toast } from 'react-hot-toast';
import { TaskList } from './components/TaskList';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [{ isLoading, error }, executeRequest] = useFetch();
  const [{ isLoading: isLoadingTasks }, executeGetTasksRequest] = useFetch();

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = (await executeGetTasksRequest(() =>
        taskService.getAll()
      )) as Task[];

      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, [executeGetTasksRequest]);

  useEffect(() => {
    if (!error?.message) {
      return;
    }

    toast.error(error?.message);
  }, [error]);

  const handleOpenModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setModalIsOpen(true);
  };

  const onEditTask = useCallback(
    (event: MouseEvent<HTMLButtonElement>, task: Task) => {
      setSelectedTask(task);
      handleOpenModal(event);
    },
    []
  );

  const onCreateNewTask = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);

      const newTask = (await executeRequest(() =>
        taskService.create(formData)
      )) as Task;

      setTasks((prev) => [newTask, ...prev]);

      toast.success('Task has been successfully created');

      setModalIsOpen(false);
    },
    [executeRequest]
  );

  const onUpdateTaskStatus = useCallback(
    async (task: Task, newStatus: TaskStatusKey) => {
      const formData = new FormData();

      formData.append('title', task.title);
      formData.append('description', task.description);
      formData.append('status', newStatus);
      formData.append('file', task.filePath);

      setTasks((prev) =>
        prev.map(
          (data) =>
            (data.id === task.id
              ? { ...data, status: newStatus }
              : data) as Task
        )
      );

      await executeRequest(() => taskService.update(task.id, formData));

      toast.success('Task status has been successfully updated');
    },
    [executeRequest]
  );

  const onUpdateTask = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);

      formData.append('status', selectedTask?.status as TaskStatusKey);
      formData.append('file', selectedTask?.filePath!);

      const updatedTask = (await executeRequest(() =>
        taskService.update(selectedTask?.id as string, formData)
      )) as Task;

      setTasks((prev) =>
        prev.map((task) => (task.id !== updatedTask.id ? task : updatedTask))
      );

      toast.success('Task has been successfully updated');

      setModalIsOpen(false);
    },
    [selectedTask, executeRequest]
  );

  const onRemoveTask = useCallback(
    async (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      await executeRequest(() => taskService.remove(taskId));

      toast.success('Task has been successfully deleted');
    },
    [executeRequest]
  );

  return (
    <div className="mx-auto my-24 max-w-[1400px] px-5 flex items-center flex-col gap-10">
      <h1 className="text-3xl font-bold text-center">Todo List</h1>

      {isLoadingTasks ? (
        <div className="mt-[20vh] z-50 ">
          <Loader size={100} />
        </div>
      ) : (
        <>
          <Button type="button" className="max-w-fit" onClick={handleOpenModal}>
            Create new task
          </Button>

          <AnimatePresence>
            {modalIsOpen && (
              <TaskModal
                isOpen={modalIsOpen}
                apiError={error}
                onSubmit={selectedTask ? onUpdateTask : onCreateNewTask}
                selectedTask={selectedTask}
                isLoading={isLoading}
                onClose={() => {
                  setModalIsOpen(false);
                  setSelectedTask(null);
                }}
                onChangeSelectedTaskFilePath={() => {
                  setSelectedTask((prev) => ({
                    ...(prev as Task),
                    filePath: '',
                  }));
                }}
                onReset={() => {
                  setSelectedTask(null);
                }}
              />
            )}
          </AnimatePresence>

          <TaskList
            tasks={tasks}
            onEditTask={onEditTask}
            onRemoveTask={onRemoveTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            isTaskPending={isLoading}
          />
        </>
      )}
    </div>
  );
}

export default App;
