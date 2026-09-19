import React, { useState } from 'react';

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  relatedTo: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'cancelled';
  assignee: string;
}

export default function Activities() {
  const [activities] = useState<Activity[]>([
    { id: '1', type: 'call', title: 'Звонок клиенту', description: 'Обсуждение условий контракта с директором', relatedTo: 'ООО "Рога и копыта"', date: '19.09.2026', time: '14:30', status: 'completed', assignee: 'Иван П.' },
    { id: '2', type: 'email', title: 'Отправлено предложение', description: 'Отправлено коммерческое предложение на сумму $75,000', relatedTo: 'АО "Звезда"', date: '19.09.2026', time: '11:15', status: 'completed', assignee: 'Мария С.' },
    { id: '3', type: 'meeting', title: 'Встреча с командой', description: 'Планерка по новым лидам и перспективам', relatedTo: 'Внутреннее', date: '20.09.2026', time: '10:00', status: 'pending', assignee: 'Алексей И.' },
    { id: '4', type: 'note', title: 'Заметка об обсуждении', description: 'Клиент интересуется скидкой на объем', relatedTo: 'ООО "Прибыль"', date: '18.09.2026', time: '16:45', status: 'completed', assignee: 'Павел Н.' },
    { id: '5', type: 'task', title: 'Задача: Подготовить счет', description: 'Требуется выставить счет для сделки', relatedTo: 'ЗАО "Вектор"', date: '19.09.2026', time: '09:00', status: 'completed', assignee: 'Наталья С.' },
    { id: '6', type: 'call', title: 'Звонок менеджеру', description: 'Уточнение сроков доставки', relatedTo: 'ИП "Успех"', date: '17.09.2026', time: '13:20', status: 'completed', assignee: 'Иван П.' }
  ]);

  const activityTypes = {
    call: { label: 'Звонок', icon: '📞', color: '#2196f3' },
    email: { label: 'Email', icon: '📧', color: '#ff9800' },
    meeting: { label: 'Встреча', icon: '👥', color: '#9c27b0' },
    note: { label: 'Заметка', icon: '📝', color: '#4caf50' },
    task: { label: 'Задача', icon: '✅', color: '#f44336' }
  };

  const statusLabels = {
    completed: { label: 'Выполнено', icon: '✅' },
    pending: { label: 'Ожидает', icon: '⏳' },
    cancelled: { label: 'Отменено', icon: '❌' }
  };

  const activityCount = {
    total: activities.length,
    calls: activities.filter(a => a.type === 'call').length,
    emails: activities.filter(a => a.type === 'email').length,
    meetings: activities.filter(a => a.type === 'meeting').length
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>📝 Активности</h1>
          <p className="subtitle">История взаимодействий и активностей</p>
        </div>
        <button className="btn btn-primary">+ Добавить активность</button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>{activityCount.total}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Всего активностей</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2196f3' }}>{activityCount.calls}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Звонков</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff9800' }}>{activityCount.emails}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Email сообщений</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9c27b0' }}>{activityCount.meetings}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Встреч</div>
          </div>
        </div>
      </div>

      <div className="card">
        <ul className="list" style={{ margin: 0 }}>
          {activities.map((activity) => (
            <li key={activity.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: '100%', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>{activityTypes[activity.type].icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="list-item-title" style={{ margin: 0 }}>{activity.title}</span>
                    <span className="tag" style={{ background: activityTypes[activity.type].color + '20', color: activityTypes[activity.type].color, margin: 0 }}>
                      {activityTypes[activity.type].label}
                    </span>
                    <span className="tag" style={{ background: activity.status === 'completed' ? '#e8f5e9' : '#fff3e0', color: activity.status === 'completed' ? '#4caf50' : '#ff9800', margin: 0 }}>
                      {statusLabels[activity.status].icon} {statusLabels[activity.status].label}
                    </span>
                  </div>
                  <div className="list-item-meta" style={{ marginBottom: '0.5rem' }}>{activity.description}</div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#999' }}>
                    <span>📌 {activity.relatedTo}</span>
                    <span>👤 {activity.assignee}</span>
                    <span>📅 {activity.date} {activity.time}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>📊 Статистика активностей</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(activityTypes).map(([type, data]) => {
            const count = activities.filter(a => a.type === type).length;
            return (
              <div key={type} style={{ padding: '1rem', borderRadius: '4px', background: '#f9f9f9', border: `2px solid ${data.color}20` }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  {data.icon} {data.label}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: data.color, marginBottom: '0.25rem' }}>
                  {count}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#999' }}>
                  {((count / activities.length) * 100).toFixed(0)}% от всех активностей
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
