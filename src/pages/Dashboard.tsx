import React from 'react';

export default function Dashboard() {
  const stats = [
    { label: 'Всего контактов', value: '327', icon: '👥', color: '#667eea' },
    { label: 'Активные лиды', value: '45', icon: '🎯', color: '#4caf50' },
    { label: 'Открытые сделки', value: '23', icon: '💰', color: '#ff9800' },
    { label: 'Завершённые задачи', value: '156', icon: '✅', color: '#2196f3' }
  ];

  const recentLeads = [
    { id: '1', name: 'ООО "Технолайн"', status: 'new', amount: '$50,000', date: '19.09.2026' },
    { id: '2', name: 'АО "Финанс-групп"', status: 'qualified', amount: '$75,000', date: '18.09.2026' },
    { id: '3', name: 'ИП "СидоровИТ"', status: 'contacted', amount: '$25,000', date: '17.09.2026' }
  ];

  const upcomingTasks = [
    { id: '1', title: 'Звонок клиенту ООО "Рога и копыта"', dueDate: '20.09.2026', priority: 'high' },
    { id: '2', title: 'Отправить коммерческое предложение', dueDate: '21.09.2026', priority: 'medium' },
    { id: '3', title: 'Встреча с руководителем продаж', dueDate: '22.09.2026', priority: 'medium' }
  ];

  return (
    <div className="dashboard">
      <h1>📊 Дашборд</h1>
      <p className="subtitle">Общий обзор вашей деятельности</p>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2>🎯 Недавние лиды</h2>
          </div>
          <ul className="list">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="list-item">
                <div>
                  <div className="list-item-title">{lead.name}</div>
                  <div className="list-item-meta">{lead.date} • {lead.amount}</div>
                </div>
                <span className={`tag tag-${lead.status === 'new' ? 'danger' : lead.status === 'qualified' ? 'success' : 'warning'}`}>
                  {lead.status === 'new' ? 'Новый' : lead.status === 'qualified' ? 'Квалифицирован' : 'Контактирован'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>✅ Предстоящие задачи</h2>
          </div>
          <ul className="list">
            {upcomingTasks.map((task) => (
              <li key={task.id} className="list-item">
                <div>
                  <div className="list-item-title">{task.title}</div>
                  <div className="list-item-meta">{task.dueDate}</div>
                </div>
                <span className={`tag tag-${task.priority === 'high' ? 'danger' : 'warning'}`}>
                  {task.priority === 'high' ? 'Срочно' : 'Обычная'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2>💰 Прогноз доходов</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>Этот месяц</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>$125,000</div>
          </div>
          <div>
            <div style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>Следующий месяц</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4caf50' }}>$189,000</div>
          </div>
          <div>
            <div style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>Квартал</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff9800' }}>$425,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
