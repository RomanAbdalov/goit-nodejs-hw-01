const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return getContactById(contactId);
  } catch (error) {
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const newContact = { id: randomUUID(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    return null;
  }
}

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      listContacts()
        .then((contacts) => console.log(contacts))
        .catch((error) => console.error("Error listing contacts:", error));
      break;

    case "get":
      getContactById(id)
        .then((contact) => console.log(contact))
        .catch((error) => console.error("Error getting contact:", error));
      break;

    case "add":
      addContact(name, email, phone)
        .then((newContact) => console.log("Contact added:", newContact))
        .catch((error) => console.error("Error adding contact:", error));
      break;

    case "remove":
      removeContact(id)
        .then((removedContact) =>
          console.log("Contact removed:", removedContact)
        )
        .catch((error) => console.error("Error removing contact:", error));
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  invokeAction,
};
