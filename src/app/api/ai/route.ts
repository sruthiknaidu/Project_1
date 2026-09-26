import { NextRequest, NextResponse } from 'next/server';
import { getSocraticHint, getCodeReview, chatWithSocraticTA } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;
    const clientKey = req.headers.get('x-gemini-api-key') || undefined;

    switch (action) {
      case 'hint': {
        const hint = await getSocraticHint({
          ...params,
          apiKey: clientKey || params.apiKey
        });
        return NextResponse.json(hint);
      }
      case 'review': {
        const review = await getCodeReview({
          ...params,
          apiKey: clientKey || params.apiKey
        });
        return NextResponse.json(review);
      }
      case 'chat': {
        const reply = await chatWithSocraticTA({
          ...params,
          apiKey: clientKey || params.apiKey
        });
        return NextResponse.json({ reply });
      }
      default:
        return NextResponse.json({ error: 'Unknown AI action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API /api/ai error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal AI Server Error' },
      { status: 500 }
    );
  }
}
