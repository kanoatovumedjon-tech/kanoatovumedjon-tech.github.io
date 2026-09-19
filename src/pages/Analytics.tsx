import React from 'react';

export default function Analytics() {
  const monthlyData = [
    { month: 'Янв', revenue: 85000, deals: 12, leads: 28 },
    { month: 'Фев', revenue: 95000, deals: 14, leads: 32 },
    { month: 'Март', revenue: 110000, deals: 16, leads: 38 },
    { month: 'Апр', revenue: 125000, deals: 18, leads: 42 },
    { month: 'Май', revenue: 145000, deals: 21, leads: 48 },
    { month: 'Июнь', revenue: 165000, deals: 24, leads: 55 }
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  const topManagers = [
    { name: 'Иван Петров', deals: 12, revenue: 450000, conversion: '45%' },
    { name: 'Мария Сидорова', deals: 8, revenue: 320000, conversion: '38%' },
    { name: 'Алексей Иванов', deals: 6, revenue: 240000, conversion: '32%' },
    { name: 'Павел Никитин', deals: 9, revenue: 380000, conversion: '42%' },
    { name: 'Наталья Соколова', deals: 4, revenue: 160000, conversion: '28%' }
  ];

  const funnel = [
    { stage: 'Лиды', count: 250, percentage: 100 },
    { stage: 'Контактировано', count: 180, percentage: 72 },
    { stage: 'Квалифицировано', count: 95, percentage: 38 },
    { stage: 'Предложение', count: 45, percentage: 18 },
    { stage: 'Выиграно', count: 23, percentage: 9 }
  ];

  const conversionRate = ((23 / 250) * 100).toFixed(1);

  return (
    <div>
      <h1>📈 Аналитика и отчеты</h1>
      <p className="subtitle">Анализ производительности и тренды</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value" style={{ color: '#4caf50' }}>$1.2M</div>
          <div className="stat-label">Доход за период</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💎</div>
          <div className="stat-value" style={{ color: '#2196f3' }}>89</div>
          <div className="stat-label">Завершено сделок</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value" style={{ color: '#ff9800' }}>{conversionRate}%</div>
          <div className="stat-label">Коэффициент конверсии</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value" style={{ color: '#9c27b0' }}>$13.5K</div>
          <div className="stat-label">Средняя сделка</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>📈 Доход по месяцам</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '300px', gap: '0.5rem', padding: '1rem' }}>
          {monthlyData.map((data) => (
            <div key={data.month} style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div
                style={{
                  height: `${(data.revenue / maxRevenue) * 250}px`,
                  background: 'linear-gradient(180deg, #667eea, #764ba2)',
                  borderRadius: '8px 8px 0 0',
                  marginBottom: '0.5rem',
                  minHeight: '20px',
                  transition: 'all 0.3s'
                }}
                title={`$${data.revenue.toLocaleString()}`}
              />
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{data.month}</div>
              <div style={{ fontSize: '0.75rem', color: '#999' }}>${(data.revenue / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>🔝 Топ менеджеры</h2>
          <ul className="list" style={{ margin: 0 }}>
            {topManagers.map((manager, index) => (
              <li key={index} className="list-item" style={{ padding: '1rem 0', gap: '1rem' }}>
                <div style={{ width: '100%' }}>
                  <div className="list-item-title">{index + 1}. {manager.name}</div>
                  <div className="list-item-meta">
                    {manager.deals} сделок • ${manager.revenue.toLocaleString()} • Конверсия: {manager.conversion}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>🔄 Воронка продаж</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {funnel.map((item, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>{item.stage}</span>
                  <span style={{ color: '#999', fontSize: '0.9rem' }}>
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.percentage}%`,
                      background: `linear-gradient(90deg, #667eea, #764ba2)`
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>📊 Ключевые показатели</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#f0f7ff', borderLeft: '4px solid #2196f3' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Среднее время цикла</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2196f3' }}>45 дней</div>
          </div>
          <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#f0f8f5', borderLeft: '4px solid #4caf50' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Успешные сделки</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4caf50' }}>92%</div>
          </div>
          <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#fff8f0', borderLeft: '4px solid #ff9800' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Потерянные лиды</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff9800' }}>8%</div>
          </div>
          <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#faf7ff', borderLeft: '4px solid #9c27b0' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>ROI маркетинга</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#9c27b0' }}>350%</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>📈 Прогноз на квартал</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Прогноз доход</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4caf50' }}>$450K</div>
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>↑ 28% рост</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Ожидаемые сделки</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2196f3' }}>42</div>
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>↑ 15% прирост</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Новые клиенты</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff9800' }}>12</div>
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>↑ 20% прирост</div>
          </div>
        </div>
      </div>
    </div>
  );
}
