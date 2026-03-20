import React, { useState, useRef, useEffect, memo } from 'react';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { Droppable } from '@hello-pangea/dnd';
import TrelloCard from './TrelloCard';

const TrelloList = memo(({ id, title, tasks, onAddCard, onDeleteCard, onCardClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAdd = () => {
    if (newCardTitle.trim()) {
      onAddCard(newCardTitle.trim(), id);
      setNewCardTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewCardTitle('');
    }
  };

  return (
    <div className="flex flex-col w-[272px] min-w-[272px] bg-[#ebecf0] rounded-xl max-h-full text-[#172b4d] shadow-sm pb-2">
      {/* List Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <h2 className="text-sm font-semibold text-[#172b4d] cursor-pointer px-1">
          {title}
        </h2>
        <button className="p-1.5 text-[#44546f] transition-colors rounded-lg hover:bg-[#091e4214]">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Container wrapped with Droppable */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            className={`flex flex-col px-2 overflow-y-auto custom-scrollbar gap-2 z-10 flex-1 min-h-0 ${snapshot.isDraggingOver ? 'bg-[#091e420f] rounded-lg' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TrelloCard key={task.id} task={task} index={index} onDeleteCard={onDeleteCard} onCardClick={onCardClick} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Button / Input */}
      <div className="px-2 pt-2">
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tiêu đề thẻ..."
              className="w-full px-3 py-2 text-[14px] text-[#172b4d] bg-white border-2 border-blue-500 rounded-lg shadow-sm focus:outline-none"
            />
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAdd}
                className="px-3 py-1.5 text-[14px] font-medium text-white bg-blue-600 rounded-[3px] hover:bg-blue-700 transition-colors"
              >
                Thêm thẻ
              </button>
              <button
                onClick={() => { setIsAdding(false); setNewCardTitle(''); }}
                className="p-1.5 text-[#44546f] hover:text-[#172b4d] hover:bg-[#091e4214] rounded-[3px] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center w-full gap-1.5 px-2 py-[6px] text-[14px] font-medium text-[#44546f] transition-colors rounded-lg hover:bg-[#091e4214] hover:text-[#172b4d] text-left"
          >
            <Plus className="w-4 h-4" />
            Thêm thẻ
          </button>
        )}
      </div>
    </div>
  );
});

export default TrelloList;
