import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Deals from './pages/Deals';
import Activities from './pages/Activities';
import Analytics from './pages/Analytics';

type PageType = 'dashboard' | 'leads' | 'clients' | 'tasks' | 'deals' | 'activities' | 'analytics';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const navItems = [
    { id: 'dashboard', label: '📊 Дашборд', icon: '📊' },
    { id: 'leads', label: '🎯 Лиды', icon: '🎯' },
    { id: 'clients', label: '👥 Клиенты', icon: '👥' },
    { id: 'tasks', label: '✅ Задачи', icon: '✅' },
    { id: 'deals', label: '💰 Сделки', icon: '💰' },
    { id: 'activities', label: '📝 Активности', icon: '📝' },
    { id: 'analytics', label: '📈 Аналитика', icon: '📈' }
  ] as const;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <Leads />;
      case 'clients':
        return <Clients />;
      case 'tasks':
        return <Tasks />;
      case 'deals':
        return <Deals />;
      case 'activities':
        return <Activities />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>📊 CRM Platform</h1>
          <p>Полное управление бизнесом в одном месте</p>
        </div>
      </header>

      <div className="main-layout">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>Меню</h2>
          </div>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.id as PageType)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="content">
          <div className="container">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
