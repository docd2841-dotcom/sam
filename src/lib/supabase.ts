import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseAnonKey.includes('your-anon-key')
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Mock data for development when Supabase is not configured
export const mockUsers = [
  {
    id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    username: 'user_demo',
    email: 'user@geocasa.com',
    password_hash: 'user123',
    first_name: 'Demo',
    last_name: 'User',
    phone: '+237 670 123 456',
    address: null,
    profile_image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    username: 'geocasa_admin',
    email: 'geocasa_admin@geocasa.com',
    password_hash: 'geocasa2024',
    first_name: 'GEOCASA',
    last_name: 'Administrator',
    phone: '+237 699 000 000',
    address: null,
    profile_image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockProperties = [
  {
    id: 'prop-1',
    title: 'Terrain à bâtir - Zone résidentielle Douala',
    description: 'Beau terrain plat de 500m² dans un quartier calme de Douala. Idéal pour construction villa.',
    type: 'terrain',
    location: 'Quartier des Fleurs, Akwa',
    city: 'Douala',
    area_sqm: 500,
    status: 'disponible',
    price: 15000000,
    presentation_video_url: null,
    latitude: 4.051056,
    longitude: 9.767869,
    features: ['eau courante', 'électricité', 'proche école', 'accès goudronné'],
    images: [
      'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prop-2',
    title: 'Villa moderne 4 chambres Douala',
    description: 'Magnifique villa moderne avec piscine et jardin à Bonneko.',
    type: 'maison',
    location: 'Bonneko',
    city: 'Douala',
    area_sqm: 280,
    status: 'disponible',
    price: 45000000,
    presentation_video_url: null,
    latitude: 4.048272,
    longitude: 9.718365,
    features: ['piscine', 'jardin', 'garage double', 'climatisation', 'sécurité 24h'],
    images: [
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prop-3',
    title: 'Appartement 3 pièces meublé Akwa',
    description: 'Appartement lumineux avec vue sur la mer à Akwa. Entièrement meublé et équipé.',
    type: 'appartement',
    location: 'Akwa Nord',
    city: 'Douala',
    area_sqm: 95,
    status: 'réservé',
    price: 25000000,
    presentation_video_url: null,
    latitude: 4.041107,
    longitude: 9.703949,
    features: ['meublé', 'vue mer', 'ascenseur', 'gardien', 'internet fibre'],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prop-4',
    title: 'Studio meublé centre-ville Yaoundé',
    description: 'Studio entièrement meublé et équipé au cœur de Yaoundé.',
    type: 'studio',
    location: 'Centre-ville',
    city: 'Yaoundé',
    area_sqm: 35,
    status: 'disponible',
    price: 8000000,
    presentation_video_url: null,
    latitude: 3.848032,
    longitude: 11.502075,
    features: ['meublé', 'cuisine équipée', 'eau chaude', 'proche transports'],
    images: [
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];