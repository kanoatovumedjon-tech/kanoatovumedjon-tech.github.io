import React, { useState } from 'react';

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'vip';
  totalDeals: number;
  revenue: number;
  joinDate: string;
}

export default function Clients() {
  const [clients] = useState<Client[]>([
    { id: '1', name: 'ООО "Рога и копыта"', contact: 'Иван Петров', email: 'ivan@example.com', phone: '+7 999 123-45-67', status: 'vip', totalDeals: 12, revenue: 450000, joinDate: '2024-01-15' },
    { id: '2', name: 'АО "Звезда"', contact: 'Мария Сидорова', email: 'maria@example.com', phone: '+7 999 234-56-78', status: 'active', totalDeals: 8, revenue: 320000, joinDate: '2024-02-20' },
    { id: '3', name: 'ООО "Прибыль"', contact: 'Алексей Иванов', email: 'alexey@example.com', phone: '+7 999 345-67-89', status: 'active', totalDeals: 5, revenue: 180000, joinDate: '2024-03-10' },
    { id: '4', name: 'ИП "Успех"', contact: 'Наталья Соколова', email: 'natalia@example.com', phone: '+7 999 456-78-90', status: 'inactive', totalDeals: 3, revenue: 85000, joinDate: '2023-06-05' },
    { id: '5', name: 'ЗАО "Вектор"', contact: 'Павел Никитин', email: 'pavel@example.com', phone: '+7 999 567-89-01', status: 'vip', totalDeals: 15, revenue: 625000, joinDate: '2023-08-12' }
  ]);

  const [search, setSearch] = useState('');

  const statusLabels = {
    active: { label: 'Активный', icon: '🟢' },
    inactive: { label: 'Неактивный', icon: '⚪' },
    vip: { label: 'VIP', icon: '⭐' }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.contact.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filteredClients.reduce((sum, client) => sum + client.revenue, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>👥 Клиенты</h1>
          <p className="subtitle">База данных клиентов и их взаимоотношений</p>
        </div>
        <button className="btn btn-primary">+ Добавить клиента</button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>{clients.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Всего клиентов</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4caf50' }}>${(totalRevenue / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Общий доход</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff9800' }}>{clients.filter(c => c.status === 'vip').length}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>VIP клиенты</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Поиск клиента..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Название</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Контакт</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Статус</th>
                <th style={{ textAlign: 'center', padding: '1rem', color: '#666', fontWeight: '600' }}>Сделок</th>
                <th style={{ textAlign: 'right', padding: '1rem', color: '#666', fontWeight: '600' }}>Доход</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#333' }}>{client.name}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{client.contact}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{client.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>
                      {statusLabels[client.status].icon}
                    </span>
                    <span className="tag">{statusLabels[client.status].label}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#667eea' }}>{client.totalDeals}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#4caf50' }}>${client.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
