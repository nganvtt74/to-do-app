import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Search, Bell, Grid, Star, Users, Briefcase } from 'lucide-react';
import { DragDropContext } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import useAuth from '../hooks/useAuth';
import useBoard from '../hooks/useBoard';
import TrelloList from '../components/TrelloList';
import CardModal from '../components/CardModal';

const DashboardPage = () => {
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);
  const { boardData, lists, addList, deleteTasksByList, fetchTasks, loading, handleMoveTask, handleAddCard, handleDeleteCard, handleUpdateCardDetails } = useBoard();
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  // Dùng ref để đảm bảo fetchTasks chỉ gọi đúng 1 lần (strict mode safe)
  const isFetched = useRef(false);

  useEffect(() => {
    if (!isFetched.current) {
      fetchTasks();
      isFetched.current = true;
    }
  }, [fetchTasks]);

  const onDragEnd = useCallback((result) => {
    const { source, destination, draggableId } = result;

    // Kéo ra ngoài vùng droppable
    if (!destination) {
      return;
    }
    
    // Nếu kéo thả vào cùng 1 vị trí cũ thì không làm gì cả
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Gọi lên hàm handleMoveTask của useBoard để xử lý Optimistic UI & API
    handleMoveTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  }, [handleMoveTask]);

  // Bộ lọc task dựa trên thanh Search
  const filteredBoardData = useMemo(() => {
    if (!searchQuery.trim()) return boardData;
    const lowerQuery = searchQuery.toLowerCase();
    const filterFn = (task) => 
      task.title.toLowerCase().includes(lowerQuery) || 
      (task.description && task.description.toLowerCase().includes(lowerQuery));

    return lists.reduce((acc, list) => {
      acc[list.id] = (boardData[list.id] || []).filter(filterFn);
      return acc;
    }, {});
  }, [boardData, searchQuery, lists]);

  const handleAddListSubmit = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
      setIsAddingList(false);
      toast.success('Đã thêm danh sách mới');
    }
  };

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex flex-col h-screen text-sm font-sans" style={{ backgroundColor: '#0079bf' }}>
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-2 h-12 flex-none border-b border-[#00000020]" style={{ backgroundColor: '#0067a3' }}>
        {/* Left Actions */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-white/90 hover:bg-white/20 rounded-md transition-colors">
            <Grid className="w-5 h-5" />
          </button>

          <a href="#" className="flex items-center gap-1 px-3 py-1.5 text-white font-bold text-lg hover:bg-white/20 rounded-md transition-colors">
            <div className="flex gap-0.5">
              <span className="block w-1.5 h-3 bg-white/90 rounded-sm"></span>
              <span className="block w-1.5 h-4 bg-white rounded-sm"></span>
              <span className="block w-1.5 h-3.5 bg-white/90 rounded-sm"></span>
            </div>
            To-do
          </a>

          <div className="hidden md:flex items-center gap-1 mx-2">
            <button className="px-3 py-1.5 text-white text-sm font-medium hover:bg-white/20 rounded-md transition-colors">Các không gian làm việc</button>
            <button className="px-3 py-1.5 text-white text-sm font-medium hover:bg-white/20 rounded-md transition-colors">Gần đây</button>
            <button className="px-3 py-1.5 text-white text-sm font-medium hover:bg-white/20 rounded-md transition-colors">Đã đánh dấu sao</button>
          </div>
        </div>

        {/* Right Actions + Search */}
        <div className="flex items-center gap-2">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 group-focus-within:text-[#172b4d]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm thẻ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-48 md:w-64 bg-white/20 rounded-md text-white text-sm placeholder:text-white/80 focus:outline-none focus:bg-white focus:text-[#172b4d] focus:w-80 transition-all duration-300"
            />
          </div>

          <button className="p-1.5 text-white hover:bg-white/20 rounded-full transition-colors flex items-center justify-center h-8 w-8">
            <Bell className="w-5 h-5" />
          </button>

          <div className="relative group cursor-pointer">
            <div className="flex items-center justify-center w-7 h-7 font-bold text-[#172b4d] bg-gray-200 rounded-full text-xs hover:opacity-80">
              {avatarLetter}
            </div>
            {/* Nút đăng xuất nhỏ hiện ra khi hover avatar để tiện */}
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50">
              <button 
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-md shadow-lg hover:bg-red-700 whitespace-nowrap"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Board Header */}
      <div className="flex items-center justify-between px-4 h-14 flex-none bg-[#0000003D]">
        <div className="flex items-center gap-3">
          <h1 className="text-[18px] font-bold text-white px-2 py-1 rounded cursor-pointer hover:bg-white/20">
            Dự án Phát triển
          </h1>
          <button className="p-1.5 text-white hover:bg-white/20 rounded transition-colors">
            <Star className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-white/30 mx-1"></div>
          <button className="flex items-center gap-1.5 px-2 py-1 text-white hover:bg-white/20 rounded transition-colors font-medium">
            <Users className="w-4 h-4" />
            Workspace
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 text-[#172b4d] bg-[#dfe1e6] hover:bg-white rounded transition-colors font-medium ml-2 shadow-sm">
            <Briefcase className="w-4 h-4" />
            Board
          </button>
        </div>
      </div>

      {/* Board Area */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden board-scrollbar relative">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="absolute top-0 right-0 bottom-0 left-0 flex items-start flex-nowrap gap-3 p-3 w-max">
            {loading ? (
              <div className="flex items-center justify-center w-[272px] h-32 ml-4">
                <div className="text-xl font-semibold text-white/90 animate-pulse">Đang tải dữ liệu...</div>
              </div>
            ) : (
              <>
                {lists.map((list) => (
                  <TrelloList 
                    key={list.id} 
                    id={list.id} 
                    title={list.title} 
                    tasks={filteredBoardData[list.id] || []} 
                    onAddCard={handleAddCard} 
                    onDeleteCard={handleDeleteCard} 
                    onCardClick={setSelectedCard} 
                    onClearList={() => {
                      deleteTasksByList(list.id);
                      toast.success(`Đã xóa toàn bộ thẻ trong ${list.title}`);
                    }}
                  />
                ))}
                
                {/* Nút thêm danh sách */}
                <div className="shrink-0 w-[272px]">
                  {!isAddingList ? (
                    <button 
                      onClick={() => setIsAddingList(true)}
                      className="flex items-center w-full gap-2 px-3 py-3 text-[14px] font-medium text-white transition-colors bg-[#ffffff3D] rounded-xl hover:bg-[#ffffff52] text-left"
                    >
                      <span className="text-xl leading-[0]">+</span> Thêm danh sách khác
                    </button>
                  ) : (
                    <form onSubmit={handleAddListSubmit} className="p-2 bg-[#ebecf0] rounded-xl shadow-sm">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nhập tiêu đề danh sách..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onBlur={() => {
                          if (!newListName.trim()) setIsAddingList(false);
                        }}
                        className="w-full px-2 py-1.5 text-sm rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0079bf] mb-2"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          type="submit"
                          onMouseDown={(e) => e.preventDefault()} // Ngăn chặn onBlur kích hoạt trước click
                          className="px-3 py-1.5 text-sm font-medium text-white bg-[#0079bf] rounded hover:bg-[#026aa7]"
                        >
                          Thêm danh sách
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingList(false);
                            setNewListName('');
                          }}
                          className="p-1.5 text-[#42526e] hover:bg-[#091e4214] rounded"
                        >
                          ✕
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </DragDropContext>
      </main>

      {/* Render Card Modal nếu có thẻ được chọn */}
      {selectedCard && (
        <CardModal 
          task={selectedCard} 
          lists={lists} /* Truyền danh sách qua CardModal để map dropdown */
          onClose={() => setSelectedCard(null)} 
          onSave={async (id, data) => {
            await handleUpdateCardDetails(id, data);
            setSelectedCard(null); // Đóng modal sau khi save
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;