const fs = require('fs');
const path = require('path');

const inventoryFile = path.join(__dirname, '..', 'data', 'inventory.json');

function readData() {
  if (!fs.existsSync(inventoryFile)) {
    fs.writeFileSync(inventoryFile, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(inventoryFile));
}

function writeData(data) {
  fs.writeFileSync(inventoryFile, JSON.stringify(data, null, 2));
}

module.exports = {
  async getInventoryForUser(username) {
    const data = readData();
    return data[username] || [];
  },

  async addItemToInventory(username, item) {
    const data = readData();
    if (!data[username]) data[username] = [];
    data[username].push(item);
    writeData(data);
  }
};
