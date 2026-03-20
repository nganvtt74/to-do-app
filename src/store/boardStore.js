import { create } from 'zustand';

const useBoardStore = create((set, get) => ({
  tasks: [],
  lists: [
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ],

  // Quản lý List
  addList: (title) => set((state) => ({
    lists: [
      ...state.lists, 
      { id: `list-${Date.now()}`, title }
    ]
  })),

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

  // Xóa tất cả task của một cột
  deleteTasksByList: (listId) => set((state) => ({
    tasks: state.tasks.filter((task) => task.status !== listId)
  })),

  // Xử lý kéo thả task
  moveTask: (taskId, sourceStatus, destinationStatus, sourceIndex, destinationIndex) => set((state) => {
    // 1. Phân loại tất cả các tasks theo status linh động dựa trên cột hiện có
    const columns = {};
    state.lists.forEach(list => {
      columns[list.id] = state.tasks.filter(task => task.status === list.id).sort((a, b) => a.position - b.position);
    });

    const getSourceColumn = columns[sourceStatus] || [];
    const getDestColumn = columns[destinationStatus] || [];
    
    // Xóa task khỏi cột nguồn bằng cách Splice
    const [movedTask] = getSourceColumn.splice(sourceIndex, 1);
    if (!movedTask) return state; // Fail safe

    // Cập nhật lại status nếu di chuyển sang cột khác
    movedTask.status = destinationStatus;

    // Chèn task vào cột đích
    getDestColumn.splice(destinationIndex, 0, movedTask);

    // 3. Tính toán lại position (trọng số) mới cho mọi task để UI và Data đồng bộ
    let finalTasks = [];
    Object.values(columns).forEach(columnTasks => {
      finalTasks = [
        ...finalTasks,
        ...columnTasks.map((t, idx) => ({ ...t, position: idx }))
      ];
    });

    return { tasks: finalTasks };
  }),

  // Getter: Lọc các task theo status (ví dụ: 'todo', 'doing', 'done')
  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  }
}));

export default useBoardStore;
