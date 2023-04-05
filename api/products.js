const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const csvParser = require('csv-parser');

// const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

module.exports = async (req, res) => {
  const products = await parseCSV('public/products.csv');
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
        // Удалите пробелы вручную для полей "name" и "availability", если требуется

        row.code = row.code ? row.code.trim() : ''; // Замените 'name' на имя столбца в вашем файле data.csv, если необходимо
        row.name = row.name ? row.name.trim() : ''; // Замените 'name' на имя столбца в вашем файле data.csv, если необходимо
        row.price = row.price ? row.price.trim() : ''; // Замените 'name' на имя столбца в вашем файле data.csv, если необходимо
        row.availability = row.availability ? row.availability.trim() : '';
        row.id = uuidv4();
        // row.id = row.id ? row.id.trim() : '';
        products.push(row);
      })
      .on('end', () => resolve(products))
      .on('error', err => reject(err));
  });
}

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
