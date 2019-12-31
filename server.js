const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', async (req, res) => {
  res.send('Yo, its up.');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
