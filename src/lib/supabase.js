import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializamos el cliente de Supabase de manera segura
// Si no hay variables de entorno, devolvemos null para no reventar la app localmente
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn("⚠️ Advertencia: Supabase no está configurado correctamente.");
  console.warn("La aplicación utilizará datos simulados (Mock Data) por el momento.");
  console.warn("Por favor configura tu archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
}
