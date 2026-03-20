import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import useBoardStore from '../store/boardStore';
import { fetchTasksApi, updateTaskApi, createTaskApi, deleteTaskApi } from '../services/api';

const useBoard = () => {
  const { tasks, setTasks, addTask, updateTask, deleteTask, moveTask } = useBoardStore();
  const [loading, setLoading] = useState(false);

  // Hàm loadTasks gọi API thật
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi API thật để lấy về dữ liệu từ CSV
      const data = await fetchTasksApi();
      setTasks(data);
    } catch (error) {
      console.error('Lỗi khi fetch tasks:', error);
      toast.error('Không thể kết nối đến Server Backend!');
      
      // Xóa MockData vì ta chỉ muốn tập trung giao tiếp với API thật
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [setTasks]);

  // Handle Drag logic with Optimistic UI & API Rollback
  const handleMoveTask = useCallback(async (draggableId, sourceDroppableId, destinationDroppableId, sourceIndex, destinationIndex) => {
    // 1. Sao lưu state hiện tại (backup) để rollback nếu API lỗi
    const previousTasks = [...useBoardStore.getState().tasks];

    // 2. Optimistic Update: Gọi action update Zustand trực tiếp mượt mà ngay trên UI
    moveTask(draggableId, sourceDroppableId, destinationDroppableId, sourceIndex, destinationIndex);

    try {
      // 3. Gọi lên Server (Background update)
      await updateTaskApi(draggableId, {
        status: destinationDroppableId,
        position: destinationIndex
      });
    } catch (error) {
      // 4. Nếu Server báo lỗi -> Rollback UI về như cũ
      console.error('Lỗi khi lưu vị trí kéo thả, khôi phục lại...', error);
      setTasks(previousTasks);
      toast.error('Lỗi kết nối. Không thể lưu thay đổi vào CSV.');
    }
  }, [moveTask, setTasks]);

  const handleAddCard = useCallback(async (title, status) => {
    try {
      const position = tasks.filter(t => t.status === status).length; // Thêm vào cuối
      const newTaskData = { title, description: '', status, position };
      
      const createdTask = await createTaskApi(newTaskData);
      addTask(createdTask); // Update Zustand bằng data chuẩn từ Server trả về (đã bao gồm ID thực)
      toast.success('Đã thêm thẻ mới vào CSV');
    } catch (error) {
      console.error('Lỗi khi thêm thẻ mới:', error);
      toast.error('Lỗi kết nối. Không thể thêm thẻ.');
    }
  }, [tasks, addTask]);

  const handleDeleteCard = useCallback(async (taskId) => {
    // Optimistic Delete Update
    const previousTasks = [...useBoardStore.getState().tasks];
    deleteTask(taskId);

    try {
      await deleteTaskApi(taskId);
      toast.success('Đã xóa thẻ khỏi CSV');
    } catch (error) {
      console.error('Lỗi khi xóa thẻ:', error);
      toast.error('Lỗi kết nối. Khôi phục lại thẻ.');
      setTasks(previousTasks); // Rollback
    }
  }, [deleteTask, setTasks]);

  const handleUpdateCardDetails = useCallback(async (taskId, updatedData) => {
    const previousTasks = [...useBoardStore.getState().tasks];
    updateTask(taskId, updatedData); // Optimistic Update

    try {
      await updateTaskApi(taskId, updatedData);
      toast.success('Đã lưu thay đổi thẻ vào CSV');
    } catch (error) {
      console.error('Lỗi khi cập nhật chi tiết thẻ:', error);
      toast.error('Lỗi kết nối. Khôi phục lại dữ liệu.');
      setTasks(previousTasks); // Rollback
    }
  }, [updateTask, setTasks]);

  // Lọc và phân loại các task theo cột, đồng thời sắp xếp theo position
  const boardData = {
    todo: tasks.filter((task) => task.status === 'todo').sort((a, b) => a.position - b.position),
    doing: tasks.filter((task) => task.status === 'doing').sort((a, b) => a.position - b.position),
    done: tasks.filter((task) => task.status === 'done').sort((a, b) => a.position - b.position),
  };

  return {
    tasks,
    boardData,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    handleMoveTask, // Export hàm mới ra để UI xài
    handleAddCard,
    handleDeleteCard,
    handleUpdateCardDetails,
  };
};

export default useBoard;
