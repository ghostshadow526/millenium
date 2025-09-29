import { NextResponse } from 'next/server';

// POST /api/imagekit/upload
// Body: { file: base64String (no data URI), fileName: string }
// Returns: { url, thumbnailUrl?, width?, height?, fileId? }
export async function POST(request: Request) {
  try {
    const { file, fileName } = await request.json();
    if (!file || !fileName) {
      return NextResponse.json({ error: 'Missing file or fileName' }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: 'Server missing IMAGEKIT_PRIVATE_KEY' }, { status: 500 });
    }

    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const formData = new FormData();
    formData.append('file', file); // base64 string only
    formData.append('fileName', fileName);
    formData.append('useUniqueFileName', 'true');
    // Optional: folder, tags, isPrivateFile etc.

    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: formData,
    });

    const raw = await uploadRes.text();
    if (!uploadRes.ok) {
      return NextResponse.json({ error: 'ImageKit upload failed', details: raw.slice(0, 500) }, { status: uploadRes.status });
    }
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch {
      return NextResponse.json({ error: 'Invalid JSON from ImageKit', raw: raw.slice(0, 300) }, { status: 502 });
    }

    return NextResponse.json({
      url: parsed.url,
      thumbnailUrl: parsed.thumbnailUrl,
      width: parsed.width,
      height: parsed.height,
      fileId: parsed.fileId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
  }
}
