const fs = require('fs');
const path = require('path');

const inventoryFile = path.join(__dirname, '..', 'data', 'inventory.json');

function readData() {
  if (!fs.existsSync(inventoryFile)) {
    fs.writeFileSync(inventoryFile, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(inventoryFile, JSON.stringify(data, null, 2));
}

async function getInventoryForUser(username) {
  const data = readData();
  return data[username] || [];
}

async function addItemToInventory(username, item) {
  const data = readData();
  if (!data[username]) data[username] = [];
  data[username].push(item);
  writeData(data);
}

async function removeItemFromInventory(username, item) {
  const data = readData();
  if (data[username]) {
    data[username] = data[username].filter(i => i.name !== item);
    writeData(data);
  }
}

async function addItemFetch(owner, name, type) {
  const body = new URLSearchParams({
    owner,
    name,
    type,
    type2: 'add'
  });

  const res = await fetch('/profile', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!res.ok) throw new Error('Request failed: ' + res.status);
  return res; // res.redirected === true if server redirected
}

async function removeItemFetch(owner, name, type) {
  const body = new URLSearchParams({
    owner,
    name,
    type,
    type2: 'remove'
  });

  const res = await fetch('/profile', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!res.ok) throw new Error('Request failed: ' + res.status);
  return res;
}

module.exports = {
  getInventoryForUser,
  addItemToInventory,
  removeItemFromInventory,
  addItemFetch,
  removeItemFetch
};
