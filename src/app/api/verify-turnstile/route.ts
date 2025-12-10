import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    console.log('Received token for verification:', token ? 'Token present' : 'No token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    console.log('Secret key available:', !!secretKey);

    if (!secretKey) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    console.log('Calling Cloudflare Siteverify API...');
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await verifyResponse.json();
    console.log('Cloudflare response:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
