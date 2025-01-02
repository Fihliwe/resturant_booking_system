const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // or your frontend URL
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));
app.use(bodyParser.json());

// In-memory storage
let bookings = [];



// Create booking
app.post('/api/bookings', (req, res) => {
  const booking = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  
  // Check for double booking
  const existingBooking = bookings.find(b => 
    b.date === booking.date && 
    b.time === booking.time
  );

  if (existingBooking) {
    return res.status(400).json({ error: 'Time slot already booked' });
  }

  bookings.push(booking);
  res.status(201).json(booking);
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const bookingIndex = bookings.findIndex(b => b.id === id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bookings.splice(bookingIndex, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});