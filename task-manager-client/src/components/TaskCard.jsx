import { Draggable } from 'react-beautiful-dnd'

const priorityColors = {
  Todo: 'border-l-slate-600',
  InProgress: 'border-l-accent-blue',
  Done: 'border-l-accent-green',
}

export default function TaskCard({ task, index, onDelete, onEdit }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-surface-2 border border-border rounded-lg p-3.5
            border-l-2 ${priorityColors[task.status]}
            group cursor-grab active:cursor-grabbing
            transition-all duration-150
            ${snapshot.isDragging
              ? 'shadow-2xl shadow-black/60 rotate-1 scale-[1.02] border-slate-500'
              : 'hover:border-slate-600 hover:bg-surface-3'}
          `}
        >
          {/* Title */}
          <p className="text-sm font-body font-medium text-slate-200 leading-snug mb-2">
            {task.title}
          </p>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-600 font-body line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {task.assignedUserName ? (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
                  <span className="text-accent-purple text-[9px] font-bold">
                    {task.assignedUserName[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-600">{task.assignedUserName}</span>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-700">unassigned</span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(task) }}
                className="text-xs font-mono text-slate-600 hover:text-accent-blue transition-colors"
              >
                edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
                className="text-xs font-mono text-slate-600 hover:text-red-400 transition-colors"
              >
                del
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
