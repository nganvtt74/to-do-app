import React, { memo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';

const TrelloCard = memo(({ task, index, onDeleteCard, onCardClick }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div 
          className={`group relative px-3 py-2 bg-white rounded-lg shadow-[0_1px_1px_#091e4240] cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-0 transition-opacity ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400 rotate-2' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onCardClick(task)}
        >
          <h3 className="pr-12 text-sm font-medium text-[#172b4d] break-words">
            {task.title}
          </h3>
          
          {task.description && (
            <p className="pr-12 mt-1 text-xs text-[#5e6c84] truncate">
              {task.description}
            </p>
          )}

          {/* Group of action buttons - Show only on hover */}
          <div className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-1 z-10">
            {/* Nút Edit */}
            <button 
              className="flex items-center justify-center p-[6px] text-[#44546f] hover:bg-[#091e4214] hover:text-[#172b4d] rounded-[3px] transition-colors bg-[#f8f9fa] backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onCardClick(task);
              }}
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
            
            {/* Nút Delete (Thùng rác) */}
            <button 
              className="flex items-center justify-center p-[6px] text-[#44546f] hover:bg-[#ffe3e3] hover:text-[#c92a2a] rounded-[3px] transition-colors bg-[#f8f9fa] backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Bạn có chắc muốn xóa thẻ này?')) {
                  onDeleteCard(task.id);
                }
              }}
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
});

export default TrelloCard;
