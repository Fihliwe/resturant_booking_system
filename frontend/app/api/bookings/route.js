// app/api/bookings/route.js
export async function POST(req) {
  const data = await req.json();
  
  const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return Response.json({ error: 'Booking failed' }, { status: 400 });
  }

  return Response.json(await response.json(), { status: 201 });
}

export async function GET() {
  const response = await fetch('http://localhost:5000/api/bookings');
  return Response.json(await response.json());
}

// app/api/bookings/[id]/route.js
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
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}