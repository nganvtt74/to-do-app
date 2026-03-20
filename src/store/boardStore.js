import { create } from 'zustand';

const useBoardStore = create((set, get) => ({
  tasks: [],

  // Cập nhật toàn bộ danh sách task từ API
  setTasks: (newTasks) => set({ tasks: newTasks }),

  // Thêm một task mới vào mảng
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),

  // Tìm task theo ID và cập nhật nội dung
  updateTask: (taskId, updatedData) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === taskId ? { ...task, ...updatedData } : task
    )
  })),

  // Xóa task khỏi mảng theo ID
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== taskId)
  })),

  // Xử lý kéo thả task
  moveTask: (taskId, sourceStatus, destinationStatus, sourceIndex, destinationIndex) => set((state) => {
    // 1. Phân loại tất cả các tasks theo status và sắp xếp theo position hiện tại để đảm bảo index chính xác
    const columns = {
      todo: state.tasks.filter((task) => task.status === 'todo').sort((a, b) => a.position - b.position),
      doing: state.tasks.filter((task) => task.status === 'doing').sort((a, b) => a.position - b.position),
      done: state.tasks.filter((task) => task.status === 'done').sort((a, b) => a.position - b.position),
    };

    // 2. Tìm task đang được di chuyển
    const getSourceColumn = columns[sourceStatus];
    const getDestColumn = columns[destinationStatus];
    
    // Xóa task khỏi cột nguồn bằng cách Splice
    const [movedTask] = getSourceColumn.splice(sourceIndex, 1);

    // Cập nhật lại status nếu di chuyển sang cột khác
    movedTask.status = destinationStatus;

    // Chèn task vào cột đích
    getDestColumn.splice(destinationIndex, 0, movedTask);

    // 3. Tính toán lại position (trọng số) mới cho mọi task để UI và Data đồng bộ
    // Tái cấu trúc lại mảng tasks tổng (gộp lại) 
    const finalTasks = [
      ...columns.todo.map((t, idx) => ({ ...t, position: idx })),
      ...columns.doing.map((t, idx) => ({ ...t, position: idx })),
      ...columns.done.map((t, idx) => ({ ...t, position: idx })),
    ];

    return { tasks: finalTasks };
  }),

  // Getter: Lọc các task theo status (ví dụ: 'todo', 'doing', 'done')
  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  }
}));

export default useBoardStore;
