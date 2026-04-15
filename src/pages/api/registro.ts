import type { APIRoute } from 'astro';

const SUPABASE_URL = import.meta.env.SUPABASE_URL || 'https://fjxddcpjzewmqmrscykp.supabase.co';
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY || 'sb_publishable_7TG9orn93oxr1kVB9W6O1w_ZbBJ2p-S';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { email, password, nombre_empresa, rfc, direccion_fiscal, nombre_operador } = body;

    if (!email || !password || !nombre_empresa || !rfc || !direccion_fiscal || !nombre_operador) {
      return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios.' }), { status: 400, headers });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres.' }), { status: 400, headers });
    }

    // STEP 1: Create Auth account via Supabase Auth REST API
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          nombre_empresa,
          rfc,
          direccion_fiscal,
          nombre_operador,
          role: 'proveedor',
        },
      }),
    });

    const authData = await authRes.json();
    console.log('Auth signup response status:', authRes.status);
    console.log('Auth signup data:', JSON.stringify(authData, null, 2));

    if (!authRes.ok || authData.error || authData.code) {
      const msg = authData.error_description || authData.msg || authData.error || authData.message || 'Error de autenticación';
      let userMsg = msg;
      if (msg.includes('already') || msg.includes('registered')) {
        userMsg = 'Este correo ya tiene una cuenta registrada. Intenta iniciar sesión.';
      }
      return new Response(JSON.stringify({ error: userMsg }), { status: 400, headers });
    }

    const hasSession = !!authData.access_token;
    const accessToken = authData.access_token;
    let mayorista_id = null;
    let dbError = null;

    // STEP 2: Insert mayorista row using the authenticated token (if we have a session)
    const authHeader = accessToken
      ? `Bearer ${accessToken}`
      : `Bearer ${SUPABASE_KEY}`;

    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/mayoristas`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        nombre_empresa,
        ubicacion: direccion_fiscal,
        nivel_confianza: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    const dbData = await dbRes.json();
    console.log('DB insert status:', dbRes.status);
    console.log('DB insert data:', JSON.stringify(dbData));

    if (dbRes.ok && Array.isArray(dbData) && dbData.length > 0) {
      mayorista_id = dbData[0].id_mayorista;
      
      // STEP 3: Update user metadata with the mayorista_id
      if (accessToken && mayorista_id) {
        await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          method: 'PUT',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: { mayorista_id },
          }),
        });
      }
    } else {
      dbError = dbData?.message || dbData?.error || 'Error al insertar mayorista';
      console.error('DB insert failed:', dbError);
    }

    return new Response(JSON.stringify({
      success: true,
      mayorista_id,
      has_session: hasSession,
      needs_confirmation: !hasSession,
      db_error: dbError,
      email,
    }), { status: 200, headers });

  } catch (err: any) {
    console.error('Registration API error:', err);
    return new Response(JSON.stringify({ error: 'Error interno: ' + (err?.message || 'desconocido') }), { status: 500, headers });
  }
};
