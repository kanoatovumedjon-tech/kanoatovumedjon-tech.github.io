import React, { useState } from 'react';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'lost';
  amount: number;
  date: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', company: 'ООО "Технолайн"', contact: 'Виталий Смирнов', email: 'v.smirnov@techline.ru', phone: '+7 999 111-11-11', status: 'new', amount: 50000, date: '19.09.2026' },
    { id: '2', company: 'АО "Финанс-групп"', contact: 'Елена Дорошева', email: 'e.dorosheva@finance.ru', phone: '+7 999 222-22-22', status: 'qualified', amount: 75000, date: '18.09.2026' },
    { id: '3', company: 'ИП "СидоровИТ"', contact: 'Иван Сидоров', email: 'ivan@sidorovit.ru', phone: '+7 999 333-33-33', status: 'contacted', amount: 25000, date: '17.09.2026' },
    { id: '4', company: 'ООО "Логистика+"', contact: 'Мария Петрова', email: 'm.petrova@logistika.ru', phone: '+7 999 444-44-44', status: 'proposal', amount: 120000, date: '16.09.2026' },
    { id: '5', company: 'ЗАО "Строй-Дом"', contact: 'Сергей Кузнецов', email: 's.kuznetsov@stroydom.ru', phone: '+7 999 555-55-55', status: 'negotiation', amount: 85000, date: '15.09.2026' }
  ]);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusLabels = {
    new: { label: 'Новый', color: '#f44336' },
    contacted: { label: 'Контактирован', color: '#ff9800' },
    qualified: { label: 'Квалифицирован', color: '#4caf50' },
    proposal: { label: 'Отправлено КП', color: '#2196f3' },
    negotiation: { label: 'Переговоры', color: '#9c27b0' },
    lost: { label: 'Потеря', color: '#757575' }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.company.toLowerCase().includes(search.toLowerCase()) ||
                         lead.contact.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredLeads.reduce((sum, lead) => sum + lead.amount, 0);
  const statusCounts = Object.keys(statusLabels).map(status => ({
    status,
    count: leads.filter(l => l.status === status).length
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>🎯 Лиды (Потенциальные клиенты)</h1>
          <p className="subtitle">Управление потенциальными сделками</p>
        </div>
        <button className="btn btn-primary">+ Добавить лид</button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>{leads.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Всего лидов</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4caf50' }}>${(totalAmount / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Сумма сделок</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff9800' }}>{statusCounts[2].count}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Квалифицировано</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Поиск по компании или контакту..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: '200px', marginBottom: 0 }}
          >
            <option value="all">Все статусы</option>
            {Object.entries(statusLabels).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Компания</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Контакт</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Статус</th>
                <th style={{ textAlign: 'right', padding: '1rem', color: '#666', fontWeight: '600' }}>Сумма</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: '600' }}>Дата</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#333' }}>{lead.company}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{lead.contact}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{lead.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="tag" style={{ background: statusLabels[lead.status].color + '20', color: statusLabels[lead.status].color }}>
                      {statusLabels[lead.status].label}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#667eea' }}>${lead.amount.toLocaleString()}</td>
                  <td style={{ padding: '1rem', color: '#999', fontSize: '0.9rem' }}>{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
