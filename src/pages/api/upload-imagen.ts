import type { APIRoute } from 'astro';

const SUPABASE_URL = import.meta.env.SUPABASE_URL || 'https://fjxddcpjzewmqmrscykp.supabase.co';
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY || 'sb_publishable_7TG9orn93oxr1kVB9W6O1w_ZbBJ2p-S';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const proveedorId = formData.get('proveedor_id') as string | null;

    if (!file || !proveedorId) {
      return new Response(JSON.stringify({ error: 'Archivo y proveedor_id son obligatorios.' }), { status: 400, headers });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF.' }), { status: 400, headers });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'El archivo no debe superar 5MB.' }), { status: 400, headers });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${proveedorId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/productos/${filename}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: arrayBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Storage upload error:', uploadRes.status, errText);

      // If bucket doesn't exist, try to create it first
      if (uploadRes.status === 404 || errText.includes('not found')) {
        // Try creating the bucket
        const createBucketRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: 'productos',
            name: 'productos',
            public: true,
          }),
        });

        const bucketResult = await createBucketRes.text();
        console.log('Bucket creation:', createBucketRes.status, bucketResult);

        // Retry upload
        const retryRes = await fetch(`${SUPABASE_URL}/storage/v1/object/productos/${filename}`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': file.type,
            'x-upsert': 'true',
          },
          body: arrayBuffer,
        });

        if (!retryRes.ok) {
          const retryErr = await retryRes.text();
          console.error('Retry upload error:', retryRes.status, retryErr);
          return new Response(JSON.stringify({ error: 'No se pudo subir la imagen. Verifica los permisos de Storage en Supabase.' }), { status: 500, headers });
        }
      } else {
        return new Response(JSON.stringify({ error: 'Error al subir imagen: ' + errText }), { status: 500, headers });
      }
    }

    // Build public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/productos/${filename}`;

    return new Response(JSON.stringify({ success: true, url: publicUrl }), { status: 200, headers });

  } catch (err: any) {
    console.error('Upload API error:', err);
    return new Response(JSON.stringify({ error: 'Error interno: ' + (err?.message || 'desconocido') }), { status: 500, headers });
  }
};
