// flashMessages.js

const flashMessages = {
  messages: {},
  addMessage(type, ...message) {
    this.messages[type] = message ;
  },
  getMessages() {
    const messages = this.messages;
    this.messages = {}; // Borra los mensajes después de recuperarlos
    return messages;
  },
};

module.exports = flashMessages;
