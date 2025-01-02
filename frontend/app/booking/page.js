'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    date: new Date(),
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          guests: '',
          date: new Date(),
          time: ''
        });
        fetchBookings();
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchBookings();
      } else {
        console.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Make a Reservation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            <Input
              type="number"
              placeholder="Number of Guests"
              min="1"
              value={formData.guests}
              onChange={(e) => setFormData({...formData, guests: e.target.value})}
              required
            />
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData({...formData, date: date})}
              className="rounded-md border"
            />
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Booking...' : 'Book Table'}
            </Button>
          </form>
          {success && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              Booking confirmed! Please see your bookings below.
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={() => {
          setShowBookings(!showBookings);
          if (!showBookings) fetchBookings();
        }}
        className="mb-4"
      >
        {showBookings ? 'Hide My Bookings' : 'Show My Bookings'}
      </Button>

      {showBookings && (
        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{booking.name}</p>
                    <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                    <p>Time: {booking.time}</p>
                    <p>Guests: {booking.guests}</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(booking.id)}
                  >
                    Cancel
                  </Button>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-gray-500">No bookings found</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}