import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Khởi tạo một instance của axios với cấu hình cơ bản
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Thay đổi port này nếu backend chạy ở port khác
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout sau 10s nếu backend không phản hồi
});

// =========================================================================
// MOCK BACKEND SERVER (Giả lập Server ngay trên Frontend để test UI)
// Bạn có thể xóa/comment Block này lại khi đã có Backend NodeJS thật
// =========================================================================
const mock = new MockAdapter(apiClient, { delayResponse: 500 }); // Giả định delay 0.5s cho giống mạng thật

let fakeDB = [
  { id: '1', title: 'Khởi tạo dự án', description: 'Setup Vite + React', status: 'done', position: 1 },
  { id: '2', title: 'Quản lý state', description: 'Tạo authStore với Zustand', status: 'done', position: 2 },
  { id: '3', title: 'Tạo hook useBoard', description: 'Xử lý logic fetch dữ liệu', status: 'doing', position: 1 },
  { id: '4', title: 'Tích hợp DnD', description: 'Làm tính năng kéo thả task', status: 'todo', position: 1 }
];

// Mock GET /tasks
mock.onGet('/tasks').reply(200, fakeDB);

// Mock POST /tasks
mock.onPost('/tasks').reply(config => {
  const newTask = JSON.parse(config.data);
  newTask.id = Date.now().toString(); // Random ID ảo
  fakeDB.push(newTask);
  return [201, newTask];
});

// Mock PATCH /tasks/:id (dùng regex để bắt /tasks/id_bất_kì)
mock.onPatch(/\/tasks\/.+/).reply(config => {
  const idStr = config.url.split('/').pop();
  const updates = JSON.parse(config.data);
  const taskIndex = fakeDB.findIndex(t => t.id === idStr);
  
  if (taskIndex > -1) {
    fakeDB[taskIndex] = { ...fakeDB[taskIndex], ...updates };
    return [200, fakeDB[taskIndex]];
  }
  return [404, { message: 'Không tìm thấy Task' }];
});

// Mock DELETE /tasks/:id
mock.onDelete(/\/tasks\/.+/).reply(config => {
  const idStr = config.url.split('/').pop();
  fakeDB = fakeDB.filter(t => t.id !== idStr);
  return [200, { success: true }];
});
// =========================================================================

/**
 * Lấy toàn bộ danh sách task (từ file CSV thông qua BE)
 */
export const fetchTasksApi = async () => {
  try {
    const response = await apiClient.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Lỗi API khi fetch tasks:', error);
    throw error;
  }
};

/**
 * Thêm một task mới vào CSV
 * @param {Object} taskData - { title, description, status, position }
 */
export const createTaskApi = async (taskData) => {
  try {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Lỗi API khi create task:', error);
    throw error;
  }
};

/**
 * Cập nhật thuộc tính của task (khi kéo thả đổi status/position, đổi tên)
 * @param {string} taskId - ID của task cần update
 * @param {Object} data - Dữ liệu cần cập nhật { status, position... }
 */
export const updateTaskApi = async (taskId, data) => {
  try {
    // Dùng PATCH vì ta thường chỉ cập nhật một vài field nhất định (vd status, position)
    const response = await apiClient.patch(`/tasks/${taskId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi API khi update task ${taskId}:`, error);
    throw error;
  }
};

/**
 * Xóa một task khỏi file CSV
 * @param {string} taskId - ID của task cần xóa
 */
export const deleteTaskApi = async (taskId) => {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi API khi delete task ${taskId}:`, error);
    throw error;
  }
};

export default apiClient;
