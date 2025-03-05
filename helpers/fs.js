const fs = require("node:fs");

const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data.length ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error.message);
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { readJSONFile, writeJSONFile };
