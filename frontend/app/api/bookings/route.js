// app/api/bookings/[id]/route.js
export async function DELETE(req, { params }) {
  const { id } = params;
  
  try {
    const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to delete booking' }, { status: response.status });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete booking error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// app/api/bookings/route.js
export async function POST(req) {
  try {
    const data = await req.json();
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Booking failed');
    }

    return Response.json(await response.json(), { status: 201 });
  } catch (error) {
    console.error('Post booking error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/api/bookings');
    return Response.json(await response.json());
  } catch (error) {
    console.error('Get bookings error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}