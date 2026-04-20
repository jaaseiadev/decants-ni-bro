import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://html2png.dev/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('html2png API Error:', response.status, errorText);
      return NextResponse.json({ success: false, error: `API returned ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.success || !data.url) {
      return NextResponse.json({ success: false, error: 'No image URL returned from html2png' }, { status: 500 });
    }

    // Fetch the generated image directly from the provided URL
    const imageResponse = await fetch(data.url);
    if (!imageResponse.ok) {
      return NextResponse.json({ success: false, error: 'Failed to download the generated image' }, { status: 500 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // Stream the binary data back to the client directly
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="receipt.png"'
      }
    });
  } catch (err: any) {
    console.error('Server error generating receipt:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
