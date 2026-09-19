import React, { useState } from 'react';
import './App.css';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  tags: string[];
  avatar?: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com',
    phone: '+7 999 123-45-67',
    position: 'Директор',
    company: 'ООО Рога и Копыта',
    tags: ['VIP', '2024_Contract'],
    avatar: '👨‍💼'
  },
  {
    id: '2',
    firstName: 'Мария',
    lastName: 'Сидорова',
    email: 'maria@example.com',
    phone: '+7 999 234-56-78',
    position: 'Менеджер продаж',
    company: 'АО Звезда',
    tags: ['Sales', 'Active'],
    avatar: '👩‍💼'
  },
  {
    id: '3',
    firstName: 'Алексей',
    lastName: 'Иванов',
    email: 'alexey@example.com',
    phone: '+7 999 345-67-89',
    position: 'Финансовый директор',
    company: 'ООО Прибыль',
    tags: ['Finance', 'Important'],
    avatar: '👨‍💻'
  },
];

function App() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    company: ''
  });

  const filteredContacts = contacts.filter(c =>
    c.firstName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      id: Date.now().toString(),
      ...formData,
      tags: [],
      avatar: '👤'
    };
    setContacts([...contacts, newContact]);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      company: ''
    });
    setShowForm(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    setSelectedContact(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>📊 CRM Platform</h1>
          <p>Управление контактами и продажами</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="main-grid">
          {/* Left Sidebar - Contacts List */}
          <div className="contacts-panel">
            <div className="panel-header">
              <h2>Контакты ({contacts.length})</h2>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                ➕ Новый контакт
              </button>
            </div>

            {/* Search */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Поиск контактов..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Contacts List */}
            <div className="contacts-list">
              {filteredContacts.length === 0 ? (
                <div className="empty-state">
                  <p>Контактов не найдено</p>
                </div>
              ) : (
                filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="contact-avatar">{contact.avatar}</div>
                    <div className="contact-info">
                      <div className="contact-name">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="contact-role">{contact.position}</div>
                      <div className="contact-email">{contact.email}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Contact Details */}
          <div className="details-panel">
            {selectedContact ? (
              <div className="contact-details">
                <div className="details-header">
                  <div className="large-avatar">{selectedContact.avatar}</div>
                  <h2>
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h2>
                </div>

                <div className="details-section">
                  <h3>Информация</h3>
                  <div className="detail-row">
                    <span className="label">Должность:</span>
                    <span className="value">{selectedContact.position}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Компания:</span>
                    <span className="value">{selectedContact.company}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{selectedContact.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Телефон:</span>
                    <span className="value">{selectedContact.phone}</span>
                  </div>
                </div>

                {selectedContact.tags.length > 0 && (
                  <div className="details-section">
                    <h3>Теги</h3>
                    <div className="tags">
                      {selectedContact.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="details-actions">
                  <button className="btn btn-secondary">✏️ Редактировать</button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteContact(selectedContact.id)}
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Выберите контакт для просмотра подробностей</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Новый контакт</h2>
            <form onSubmit={handleAddContact}>
              <input
                type="text"
                placeholder="Имя"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Фамилия"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Должность"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
              <input
                type="text"
                placeholder="Компания"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
