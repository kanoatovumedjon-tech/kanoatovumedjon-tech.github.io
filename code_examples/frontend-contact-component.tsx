// ============================================
// Contact Component - Frontend Example
// React + TypeScript + Redux
// ============================================

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Card, Avatar, Chip, Dialog } from '@mui/material';
import { Edit, Delete, AddCircle, Merge, Download } from '@mui/icons-material';
import axios from 'axios';

// ============================================
// TYPES
// ============================================

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyName: string;
  companyId: string;
  tags: string[];
  status: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  notes: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  recentActivities: Activity[];
  createdAt: string;
}

interface Activity {
  id: string;
  activityType: string;
  subject: string;
  startTime: string;
}

// ============================================
// API SERVICE
// ============================================

class ContactAPI {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
  private token = localStorage.getItem('authToken');

  private headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async getContacts(options?: {
    limit?: number;
    offset?: number;
    search?: string;
    ownerId?: string;
    status?: string;
  }) {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.search) params.append('search', options.search);
    if (options?.ownerId) params.append('ownerId', options.ownerId);
    if (options?.status) params.append('status', options.status);

    const response = await axios.get(
      `${this.baseURL}/contacts?${params}`,
      { headers: this.headers() }
    );
    return response.data;
  }

  async getContact(id: string) {
    const response = await axios.get(
      `${this.baseURL}/contacts/${id}`,
      { headers: this.headers() }
    );
    return response.data;
  }

  async createContact(data: Partial<Contact>) {
    const response = await axios.post(
      `${this.baseURL}/contacts`,
      data,
      { headers: this.headers() }
    );
    return response.data;
  }

  async updateContact(id: string, data: Partial<Contact>) {
    const response = await axios.put(
      `${this.baseURL}/contacts/${id}`,
      data,
      { headers: this.headers() }
    );
    return response.data;
  }

  async deleteContact(id: string) {
    await axios.delete(
      `${this.baseURL}/contacts/${id}`,
      { headers: this.headers() }
    );
  }

  async addTag(contactId: string, tag: string) {
    await axios.post(
      `${this.baseURL}/contacts/${contactId}/tags`,
      { tag },
      { headers: this.headers() }
    );
  }

  async removeTag(contactId: string, tag: string) {
    await axios.delete(
      `${this.baseURL}/contacts/${contactId}/tags/${tag}`,
      { headers: this.headers() }
    );
  }

  async mergeContacts(primaryId: string, secondaryId: string) {
    const response = await axios.post(
      `${this.baseURL}/contacts/${primaryId}/merge`,
      { secondaryContactId: secondaryId },
      { headers: this.headers() }
    );
    return response.data;
  }
}

// ============================================
// CONTACT FORM COMPONENT
// ============================================

interface ContactFormProps {
  contact?: Contact;
  companyId?: string;
  onSave: (contact: Contact) => void;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  companyId,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Partial<Contact>>(
    contact || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      companyId: companyId,
      notes: ''
    }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const api = new ContactAPI();
      let savedContact: Contact;

      if (contact?.id) {
        savedContact = await api.updateContact(contact.id, formData);
      } else {
        savedContact = await api.createContact(formData);
      }

      onSave(savedContact);
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className=\"space-y-4 p-6\">
        {errors.submit && (
          <div className=\"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded\">
            {errors.submit}
          </div>
        )}

        <TextField
          label=\"First Name *\"
          value={formData.firstName || ''}
          onChange={(e) => handleChange('firstName', e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName}
          fullWidth
          variant=\"outlined\"
        />

        <TextField
          label=\"Last Name\"
          value={formData.lastName || ''}
          onChange={(e) => handleChange('lastName', e.target.value)}
          fullWidth
          variant=\"outlined\"
        />

        <TextField
          label=\"Email *\"
          type=\"email\"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          variant=\"outlined\"
        />

        <TextField
          label=\"Phone\"
          value={formData.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          fullWidth
          variant=\"outlined\"
        />

        <TextField
          label=\"Position\"
          value={formData.position || ''}
          onChange={(e) => handleChange('position', e.target.value)}
          fullWidth
          variant=\"outlined\"
        />

        <TextField
          label=\"Notes\"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          multiline
          rows={4}
          fullWidth
          variant=\"outlined\"
        />

        <div className=\"flex gap-2 justify-end\">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type=\"submit\"
            variant=\"contained\"
            color=\"primary\"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Contact'}
          </Button>
        </div>
      </div>
    </form>
  );
};

// ============================================
// CONTACT LIST COMPONENT
// ============================================

interface ContactListProps {
  companyId?: string;
}

const ContactList: React.FC<ContactListProps> = ({ companyId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit] = useState(20);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const api = new ContactAPI();

  useEffect(() => {
    loadContacts();
  }, [search, offset, companyId]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const result = await api.getContacts({
        search: search || undefined,
        offset,
        limit
      });

      setContacts(result.data);
      setTotalContacts(result.pagination.total);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setEditingContact(null);
    setFormOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setFormOpen(true);
  };

  const handleDelete = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.deleteContact(contactId);
        loadContacts();
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  const handleSaveContact = (contact: Contact) => {
    loadContacts();
  };

  const handleTagAdd = async (contactId: string, tag: string) => {
    try {
      await api.addTag(contactId, tag);
      loadContacts();
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  const handleTagRemove = async (contactId: string, tag: string) => {
    try {
      await api.removeTag(contactId, tag);
      loadContacts();
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const handleViewDetails = async (contactId: string) => {
    try {
      const contact = await api.getContact(contactId);
      setSelectedContact(contact);
    } catch (error) {
      console.error('Failed to load contact details:', error);
    }
  };

  return (
    <div className=\"p-6\">
      <div className=\"flex justify-between items-center mb-6\">
        <h1 className=\"text-3xl font-bold\">Contacts</h1>
        <Button
          variant=\"contained\"
          color=\"primary\"
          startIcon={<AddCircle />}
          onClick={handleCreateClick}
        >
          New Contact
        </Button>
      </div>

      <div className=\"mb-6 flex gap-4\">
        <TextField
          placeholder=\"Search contacts...\"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          fullWidth
          variant=\"outlined\"
        />
      </div>

      {loading ? (
        <div className=\"text-center py-8\">Loading...</div>
      ) : (
        <>
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
            {contacts.map(contact => (
              <Card
                key={contact.id}
                className=\"p-4 hover:shadow-lg transition cursor-pointer\"
                onClick={() => handleViewDetails(contact.id)}
              >
                <div className=\"flex items-start justify-between mb-4\">
                  <div className=\"flex items-start gap-3 flex-1\">
                    <Avatar
                      src={contact.avatarUrl}
                      alt={`${contact.firstName} ${contact.lastName}`}
                    />
                    <div className=\"flex-1\">
                      <h3 className=\"font-bold\">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className=\"text-sm text-gray-600\">{contact.position}</p>
                      <p className=\"text-sm text-gray-600\">{contact.companyName}</p>
                    </div>
                  </div>
                </div>

                <div className=\"space-y-2 mb-4\">
                  <p className=\"text-sm\">📧 {contact.email}</p>
                  <p className=\"text-sm\">📞 {contact.phone}</p>
                </div>

                {contact.tags && contact.tags.length > 0 && (
                  <div className=\"flex flex-wrap gap-2 mb-4\">
                    {contact.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size=\"small\"
                        onDelete={() => handleTagRemove(contact.id, tag)}
                      />
                    ))}
                  </div>
                )}

                <div className=\"flex gap-2\">
                  <Button
                    size=\"small\"
                    startIcon={<Edit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(contact);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size=\"small\"
                    color=\"error\"
                    startIcon={<Delete />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className=\"mt-6 flex justify-between items-center\">
            <p className=\"text-gray-600\">
              Showing {offset + 1}-{Math.min(offset + limit, totalContacts)} of {totalContacts} contacts
            </p>
            <div className=\"flex gap-2\">
              <Button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
              >
                Previous
              </Button>
              <Button
                disabled={offset + limit >= totalContacts}
                onClick={() => setOffset(offset + limit)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth=\"sm\"
        fullWidth
      >
        <ContactForm
          contact={editingContact || undefined}
          companyId={companyId}
          onSave={handleSaveContact}
          onClose={() => setFormOpen(false)}
        />
      </Dialog>

      {selectedContact && (
        <Dialog
          open={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          maxWidth=\"md\"
          fullWidth
        >
          <div className=\"p-6\">
            <div className=\"flex items-center gap-4 mb-6\">
              <Avatar
                src={selectedContact.avatarUrl}
                alt={`${selectedContact.firstName} ${selectedContact.lastName}`}
                sx={{ width: 80, height: 80 }}
              />
              <div>
                <h2 className=\"text-2xl font-bold\">
                  {selectedContact.firstName} {selectedContact.lastName}
                </h2>
                <p className=\"text-gray-600\">{selectedContact.position}</p>
              </div>
            </div>

            <div className=\"grid grid-cols-2 gap-6\">
              <div>
                <h3 className=\"font-bold mb-2\">Contact Info</h3>
                <p>Email: {selectedContact.email}</p>
                <p>Phone: {selectedContact.phone}</p>
              </div>

              <div>
                <h3 className=\"font-bold mb-2\">Company</h3>
                <p>{selectedContact.companyName}</p>
              </div>

              {selectedContact.recentActivities && selectedContact.recentActivities.length > 0 && (
                <div className=\"col-span-2\">
                  <h3 className=\"font-bold mb-2\">Recent Activities</h3>
                  <ul className=\"space-y-2\">
                    {selectedContact.recentActivities.map(activity => (
                      <li key={activity.id} className=\"text-sm border-l-2 pl-2\">
                        <strong>{activity.activityType}</strong>: {activity.subject}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className=\"mt-6 flex gap-2\">
              <Button
                variant=\"contained\"
                onClick={() => {
                  setEditingContact(selectedContact);
                  setFormOpen(true);
                  setSelectedContact(null);
                }}
              >
                Edit
              </Button>
              <Button
                color=\"error\"
                onClick={() => {
                  handleDelete(selectedContact.id);
                  setSelectedContact(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ContactList;
