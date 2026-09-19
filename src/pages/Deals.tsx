import React, { useState } from 'react';

interface Deal {
  id: string;
  name: string;
  company: string;
  amount: number;
  stage: 'negotiation' | 'proposal' | 'contract' | 'won' | 'lost';
  probability: number;
  closingDate: string;
  manager: string;
}

export default function Deals() {
  const [deals] = useState<Deal[]>([
    { id: '1', name: 'Контракт на ПО', company: 'ООО "Рога и копыта"', amount: 150000, stage: 'contract', probability: 80, closingDate: '28.09.2026', manager: 'Иван П.' },
    { id: '2', name: 'Консультационные услуги', company: 'АО "Звезда"', amount: 85000, stage: 'proposal', probability: 60, closingDate: '05.10.2026', manager: 'Мария С.' },
    { id: '3', name: 'Поставка оборудования', company: 'ООО "Прибыль"', amount: 250000, stage: 'negotiation', probability: 40, closingDate: '15.10.2026', manager: 'Алексей И.' },
    { id: '4', name: 'Внедрение системы', company: 'ЗАО "Вектор"', amount: 320000, stage: 'contract', probability: 75, closingDate: '10.10.2026', manager: 'Павел Н.' },
    { id: '5', name: 'Техническая поддержка', company: 'ИП "Успех"', amount: 45000, stage: 'won', probability: 100, closingDate: '19.09.2026', manager: 'Наталья С.' }
  ]);

  const stageLabels = {
    negotiation: { label: 'Переговоры', order: 1, color: '#ff9800' },
    proposal: { label: 'Предложение', order: 2, color: '#2196f3' },
    contract: { label: 'Контракт', order: 3, color: '#9c27b0' },
    won: { label: 'Выиграно', order: 4, color: '#4caf50' },
    lost: { label: 'Потеря', order: 5, color: '#f44336' }
  };

  const dealsByStage = {
    negotiation: deals.filter(d => d.stage === 'negotiation'),
    proposal: deals.filter(d => d.stage === 'proposal'),
    contract: deals.filter(d => d.stage === 'contract'),
    won: deals.filter(d => d.stage === 'won'),
    lost: deals.filter(d => d.stage === 'lost')
  };

  const totalDealValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const expectedValue = deals.reduce((sum, deal) => sum + (deal.amount * deal.probability / 100), 0);

  return (
    <div>
      <div>
        <h1>💰 Сделки (Sales Pipeline)</h1>
        <p className="subtitle">Управление этапами продаж и прогнозом доходов</p>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>{deals.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Всего сделок</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff9800' }}>${(totalDealValue / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Сумма всех сделок</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '4px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4caf50' }}>${(expectedValue / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Прогноз (взвешенная сумма)</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {Object.entries(dealsByStage).map(([stage, stageDeal]) => (
          <div key={stage} className="card">
            <h3 style={{ color: stageLabels[stage as keyof typeof stageLabels].color, marginBottom: '1rem' }}>
              {stageLabels[stage as keyof typeof stageLabels].label}
            </h3>
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
              {stageDeal.length} сделок • ${stageDeal.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
            </div>

            <ul className="list" style={{ margin: 0 }}>
              {stageDeal.map((deal) => (
                <li key={deal.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem 0' }}>
                  <div style={{ width: '100%' }}>
                    <div className="list-item-title">{deal.name}</div>
                    <div className="list-item-meta">{deal.company}</div>
                  </div>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: '#999' }}>
                      👤 {deal.manager} • 📅 {deal.closingDate}
                    </div>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>${deal.amount.toLocaleString()}</span>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>Вероятность: {deal.probability}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${deal.probability}%` }}></div>
                    </div>
                  </div>
                </li>
              ))}
              {stageDeal.length === 0 && (
                <li style={{ textAlign: 'center', color: '#999', padding: '2rem 0' }}>
                  Нет сделок на этом этапе
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
