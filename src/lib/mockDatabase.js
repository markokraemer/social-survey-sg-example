// Mock database to simulate data persistence

let mockMessages = [
  { id: 1, sender: 'John Doe', content: 'Hello, how can I help you today?', timestamp: '10:00 AM', attachments: [] },
  { id: 2, sender: 'You', content: 'I have a question about the recent survey.', timestamp: '10:05 AM', attachments: [] },
  { id: 3, sender: 'John Doe', content: 'Sure, what would you like to know?', timestamp: '10:07 AM', attachments: [] },
  { id: 4, sender: 'You', content: 'I\'m having trouble with the branching logic. Can you take a look?', timestamp: '10:10 AM', attachments: [{ name: 'survey_screenshot.png', url: '#' }] },
  { id: 5, sender: 'John Doe', content: 'Of course, I\'d be happy to help. Can you provide more details about where you\'re encountering issues?', timestamp: '10:15 AM', attachments: [] },
];

let mockContacts = [
  { id: 1, name: 'John Doe', avatar: '/api/placeholder/40/40', status: 'online' },
  { id: 2, name: 'Jane Smith', avatar: '/api/placeholder/40/40', status: 'offline' },
  { id: 3, name: 'Alice Johnson', avatar: '/api/placeholder/40/40', status: 'away' },
];

export const getMessages = () => {
  return mockMessages;
};

export const addMessage = (message) => {
  mockMessages.push(message);
  return message;
};

export const updateMessage = (id, newContent) => {
  const index = mockMessages.findIndex(msg => msg.id === id);
  if (index !== -1) {
    mockMessages[index] = { ...mockMessages[index], content: newContent };
    return mockMessages[index];
  }
  return null;
};

export const deleteMessage = (id) => {
  mockMessages = mockMessages.filter(msg => msg.id !== id);
};

export const getContacts = () => {
  return mockContacts;
};

export const addContact = (contact) => {
  mockContacts.push(contact);
  return contact;
};

export const updateContact = (id, updates) => {
  const index = mockContacts.findIndex(contact => contact.id === id);
  if (index !== -1) {
    mockContacts[index] = { ...mockContacts[index], ...updates };
    return mockContacts[index];
  }
  return null;
};

export const deleteContact = (id) => {
  mockContacts = mockContacts.filter(contact => contact.id !== id);
};