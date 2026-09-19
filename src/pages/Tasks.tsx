import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
  relatedTo: string;
}

export default function Tasks() {
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Звонок клиенту ООО "Рога и копыта"', description: 'Обсудить условия контракта', dueDate: '20.09.2026', priority: 'high', status: 'in-progress', assignee: 'Иван П.', relatedTo: 'Рога и копыта' },
    { id: '2', title: 'Отправить коммерческое предложение', description: 'КП для АО "Звезда"', dueDate: '21.09.2026', priority: 'high', status: 'todo', assignee: 'Мария С.', relatedTo: 'Звезда' },
    { id: '3', title: 'Встреча с руководителем продаж', description: 'Планерка по новым лидам', dueDate: '22.09.2026', priority: 'medium', status: 'todo', assignee: 'Алексей И.', relatedTo: 'Внутреннее' },
    { id: '4', title: 'Отправить счет клиенту', description: 'Счет за завершенный проект', dueDate: '19.09.2026', priority: 'high', status: 'done', assignee: 'Павел Н.', relatedTo: 'Вектор' },
    { id: '5', title: 'Анализ конкурентов', description: 'Исследование рынка', dueDate: '25.09.2026', priority: 'medium', status: 'todo', assignee: 'Наталья С.', relatedTo: 'Аналитика' }
  ]);

  const [filter, setFilter] = useState<string>('all');

  const priorityLabels = {
    high: { label: 'Срочно', color: '#f44336' },
    medium: { label: 'Обычная', color: '#ff9800' },
    low: { label: 'Низкая', color: '#4caf50' }
  };

  const statusLabels = {
    'todo': { label: 'К выполнению', icon: '⭕' },
    'in-progress': { label: 'В процессе', icon: '🔵' },
    'done': { label: 'Выполнено', icon: '✅' }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>✅ Задачи</h1>
          <p className="subtitle">Управление рабочими задачами и активностями</p>
        </div>
        <button className="btn btn-primary">+ Добавить задачу</button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>{taskStats.total}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Всего задач</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4caf50' }}>{taskStats.completed}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Выполнено</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2196f3' }}>{taskStats.inProgress}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>В работе</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff9800' }}>{taskStats.todo}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>К выполнению</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button
            className={`btn ${filter === 'todo' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={() => setFilter('todo')}
          >
            К выполнению
          </button>
          <button
            className={`btn ${filter === 'in-progress' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={() => setFilter('in-progress')}
          >
            В процессе
          </button>
          <button
            className={`btn ${filter === 'done' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={() => setFilter('done')}
          >
            Выполнено
          </button>
        </div>

        <ul className="list">
          {filteredTasks.map((task) => (
            <li key={task.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem' }}>{statusLabels[task.status].icon}</span>
                  <div>
                    <div className="list-item-title">{task.title}</div>
                    <div className="list-item-meta">{task.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="tag" style={{ background: priorityLabels[task.priority].color + '20', color: priorityLabels[task.priority].color }}>
                    {priorityLabels[task.priority].label}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', width: '100%', fontSize: '0.85rem', color: '#999' }}>
                <span>📅 {task.dueDate}</span>
                <span>👤 {task.assignee}</span>
                <span>📌 {task.relatedTo}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
