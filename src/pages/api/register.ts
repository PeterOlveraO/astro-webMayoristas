import type { APIRoute } from 'astro';

const API_URL = import.meta.env.API_URL ?? 'http://localhost:5145';

export const POST: APIRoute = async ({ request, cookies }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { email, password, nombre_empresa, rfc, direccion_fiscal, telefono_contacto, ubicacion} = body;

    if (!email || !password || !nombre_empresa || !rfc || !direccion_fiscal || !telefono_contacto || !ubicacion) {
      return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios.' }), {
        status: 400, headers
      });
    }

    const requestBody = {
      email,
      password,
      rol: 'mayorista',
      nombre_empresa,
      rfc,
      direccion_fiscal,
      ubicacion,
      telefono_contacto
    };
    console.log('[MAYORISTA REGISTER] Keys enviadas a C#:', Object.keys(requestBody));
    console.log('[MAYORISTA REGISTER] Body completo:', requestBody);

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    console.log('[MAYORISTA REGISTER] Datos recibidos del formulario:', {
      email, nombre_empresa, rfc, direccion_fiscal, telefono_contacto, ubicacion
    });
    console.log('[MAYORISTA REGISTER] Datos enviados a API:', {
      email, rol: 'mayorista', nombre_empresa, rfc, direccion_fiscal, ubicacion, telefono_contacto
    });

    const data = await res.json();
    console.log('[MAYORISTA REGISTER] Respuesta de API:', data);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message ?? data.error ?? 'Error al crear la cuenta.' }), {
        status: res.status, headers
      });
    }

    // Cookies de sesión
    //cookies.set('proveedor_id', String(data.id ?? data.mayorista_id), {
     // path: '/', httpOnly: true, secure: false,
      //maxAge: 60 * 60 * 24 * 7, sameSite: 'lax'
    //});
    //cookies.set('proveedor_nombre', nombre_empresa, {
     // path: '/', httpOnly: false, secure: false,
      //maxAge: 60 * 60 * 24 * 7, sameSite: 'lax'
    //});

    return new Response(JSON.stringify({ success: true }), { status: 201, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), {
      status: 500, headers
    });
  }
};