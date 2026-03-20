import React, { useEffect } from 'react';
import { X, CreditCard, AlignLeft, Calendar, Layout } from 'lucide-react';
import useForm from '../hooks/useForm';

// Hàm validate đơn giản
const validateTask = (values) => {
  const errors = {};
  if (!values.title || !values.title.trim()) {
    errors.title = 'Tiêu đề không được để trống';
  }
  return errors;
};

const CardModal = ({ task, lists = [], onClose, onSave }) => {
  const { values, errors, handleChange, isValid } = useForm({
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'todo',
  }, validateTask);

  // Đóng Modal khi nhấn Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && values.title.trim()) {
      onSave(task.id, {
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status,
      });
    }
  };

  const currentList = lists.find(l => l.id === task.status);
  const currentStatus = currentList ? currentList.title : 'Không xác định';
  // Mock ngày tạo nếu task k có
  const createdAt = task.createdAt 
    ? new Date(task.createdAt).toLocaleString('vi-VN') 
    : 'Chưa cập nhật';

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-[#000000a6] overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col w-full max-w-[768px] bg-[#f1f2f4] rounded-xl shadow-xl min-h-[400px] mb-20 text-[#172b4d]"
        onClick={(e) => e.stopPropagation()} // Chặn click out
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#44546f] hover:bg-[#091e4214] hover:text-[#172b4d] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6 md:px-8">
          
          {/* Header / Title */}
          <div className="flex items-start gap-4 mb-8">
            <CreditCard className="w-6 h-6 mt-1 text-[#44546f]" />
            <div className="flex-1 w-full">
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xl font-semibold bg-transparent border-2 border-transparent rounded-[3px] focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                placeholder="Nhập tiêu đề thẻ..."
                autoFocus
              />
              {errors.title && <span className="block px-2 mt-1 text-sm text-red-500">{errors.title}</span>}
              <p className="px-2 mt-1 text-sm text-[#44546f]">
                Trong danh sách <span className="font-semibold underline underline-offset-2">{currentStatus}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Cột trái (Main content) */}
            <div className="flex-1 space-y-8">
              {/* Description */}
              <div className="flex items-start gap-4">
                <AlignLeft className="w-6 h-6 mt-1 text-[#44546f]" />
                <div className="flex-1 w-full">
                  <h3 className="text-base font-semibold mb-2">Mô tả</h3>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#091e4224] rounded-[3px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-[#44546f]"
                    placeholder="Thêm mô tả chi tiết hơn..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Cột phải (Sidebar Data) */}
            <div className="flex flex-col w-full md:w-[200px] shrink-0 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-[#44546f] uppercase mb-3">Thông tin phụ</h4>
                <div className="flex items-center gap-2 px-3 py-2 text-sm bg-[#091e420f] rounded-md font-medium text-[#172b4d]">
                  <Layout className="w-4 h-4 text-[#44546f]" />
                  <span>Trạng thái: </span>
                  <select
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    className="ml-auto bg-transparent focus:outline-none cursor-pointer text-sm text-[#172b4d] font-semibold"
                  >
                    {lists.map(list => (
                      <option key={list.id} value={list.id}>{list.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 mt-2 text-sm bg-[#091e420f] rounded-md font-medium text-[#172b4d]">
                  <Calendar className="w-4 h-4 text-[#44546f]" />
                  <span>Tạo lúc: </span>
                </div>
                <p className="px-3 mt-1 text-xs text-[#44546f]">{createdAt}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 mt-auto">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!isValid || !values.title.trim()}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[3px] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-[#172b4d] bg-[#091e420f] rounded-[3px] hover:bg-[#091e4224] transition-colors"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CardModal;