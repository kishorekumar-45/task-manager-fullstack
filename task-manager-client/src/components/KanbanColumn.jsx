import { Droppable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'

const columnMeta = {
  Todo: {
    label: 'To Do',
    dot: 'bg-slate-500',
    badge: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
    drop: 'bg-slate-500/5 border-slate-500/20',
  },
  InProgress: {
    label: 'In Progress',
    dot: 'bg-accent-blue',
    badge: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    drop: 'bg-accent-blue/5 border-accent-blue/20',
  },
  Done: {
    label: 'Done',
    dot: 'bg-accent-green',
    badge: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    drop: 'bg-accent-green/5 border-accent-green/20',
  },
}

export default function KanbanColumn({ status, tasks, onDelete, onEdit, onAddTask }) {
  const meta = columnMeta[status]

  return (
    <div className="flex flex-col min-w-[280px] w-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
          <span className="font-display font-semibold text-sm text-slate-300">{meta.label}</span>
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${meta.badge}`}>
            {tasks.length}
          </span>
        </div>
        {status === 'Todo' && (
          <button
            onClick={onAddTask}
            className="text-xs font-mono text-slate-600 hover:text-accent-blue transition-colors"
          >
            + add
          </button>
        )}
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex flex-col gap-2.5 flex-1 min-h-[200px] rounded-xl p-2.5
              border border-dashed transition-all duration-200
              ${snapshot.isDraggingOver ? `${meta.drop} border-solid` : 'border-transparent'}
            `}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center flex-1 py-8">
                <p className="text-xs font-mono text-slate-700">drop here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
