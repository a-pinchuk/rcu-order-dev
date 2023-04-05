const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const csvParser = require('csv-parser');
const path = require('path');

app.use(cors());
app.use(express.json());

module.exports = async (req, res) => {
  const products = await parseCSV(
    path.join(__dirname, '../public/products.csv')
  );
  res.json(products);
};

function parseCSV(filename) {
  return new Promise((resolve, reject) => {
    const products = [];
    fs.createReadStream(filename)
      .pipe(
        csvParser({
          separator: ';',
          trim: true,
          headers: ['code', 'name', 'price', 'availability', 'id'],
          quote: '',
        })
      )
      .on('data', row => {
        row.code = row.code ? row.code.trim() : '';
        row.name = row.name ? row.name.trim() : '';
        row.price = row.price ? row.price.trim() : '';
        row.availability = row.availability ? row.availability.trim() : '';
        row.id = uuidv4();
        products.push(row);
      })
      .on('end', () => resolve(products))
      .on('error', err => reject(err));
  });
}
