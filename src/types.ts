/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  user_id: number;
  name: string;
  role: 'FARMER' | 'AGENT' | 'DOCTOR' | 'ADMIN' | 'BUYER' | 'AGRI_OFFICER';
  phone_number: string;
  upazila_district: string;
  joined_date: string;
}

export interface FarmerProfile {
  farmer_id: number;
  experience_years: number;
  farm_size_acres: number;
  current_level: 'Seedling Farmer' | 'Harvest Master' | 'Agro-Innovator';
  global_trust_score: number; // 0 to 100
  primary_crops: string[];
  eco_score: number; // 0 to 100
  on_time_delivery_rate: number; // 0 to 100
}

export interface CropBatch {
  batch_id: number;
  farmer_id: number;
  farmer_name: string;
  upazila_district: string;
  crop_name: string;
  estimated_harvest_date: string;
  quantity_kg: number;
  base_price_per_kg: number;
  officer_verified: boolean;
  production_grade: 'A' | 'B' | 'C' | null;
  certified_by_officer_id: number | null;
  imageUrl: string | null;
  status: 'AVAILABLE' | 'RESERVED' | 'COMPLETED';
}

export interface OfficerProfile {
  officer_id: number;
  gov_id: string;
  specialization: string;
  resolved_tickets_count: number;
  community_rating: number; // 1.0 to 5.0
  response_time_minutes: number; // Speed metric
  field_visits_count: number;
}

export interface EscrowContract {
  bid_id: number;
  batch_id: number;
  crop_name: string;
  buyer_id: number;
  buyer_name: string;
  farmer_id: number;
  farmer_name: string;
  quantity_kg: number;
  amount_total: number;
  status: 'PENDING' | 'SECURED_IN_ESCROW' | 'RELEASED_TO_FARMER' | 'REFUNDED_TO_BUYER';
  delivery_date: string | null;
  quality_check_passed: boolean | null;
}

export interface AgriTicket {
  ticket_id: number;
  farmer_id: number;
  farmer_name: string;
  crop_name: string;
  upazila_district: string;
  description: string;
  imageUrl: string | null;
  solved: boolean;
  assigned_officer_id: number | null;
  response_text: string | null;
  ai_diagnosed_disease: string | null;
  soil_npk_advice: string | null;
  created_at: string;
  solved_at: string | null;
}

export interface LogisticsPool {
  pool_id: number;
  upazila_district: string;
  crop_name: string;
  farmer_count: number;
  total_quantity_kg: number;
  savings_percentage: number;
  status: 'READY' | 'DISPATCHED';
}

export interface DoctorAppointment {
  appointment_id: number;
  farmer_id: number;
  farmer_name: string;
  farmer_phone: string;
  jela_district: string;
  doctor_id: number;
  doctor_name: string;
  crop_name: string;
  problem_description: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'DECLINED';
  prescription_notes?: string;
  appointment_date: string;
  appointment_time: string;
  notification_sent: boolean;
  created_at: string;
}

export type LanguageMode = 'EN' | 'BN';
export type ThemeMode = 'LIGHT' | 'DARK' | 'EARTH';

export interface CommunityComment {
  comment_id: number;
  author_id: number;
  author_name: string;
  author_role: string;
  text: string;
  created_at: string;
}

export interface CommunityPost {
  post_id: number;
  author_id: number;
  author_name: string;
  author_role: 'FARMER' | 'AGENT' | 'DOCTOR' | 'ADMIN' | 'BUYER' | 'AGRI_OFFICER';
  author_district: string;
  category: 'PEST_ALERT' | 'FARMING_TIP' | 'MARKET_PRICE' | 'HARVEST_NEWS' | 'QUESTION';
  title: string;
  content: string;
  imageUrl?: string;
  crop_tag?: string;
  upvotes: number;
  upvoted_user_ids: number[];
  comments: CommunityComment[];
  created_at: string;
  is_verified_officer?: boolean;
}

export interface CartItem {
  batch: CropBatch;
  order_quantity_kg: number;
}

export interface StoreOrder {
  order_id: number;
  buyer_name: string;
  buyer_phone: string;
  shipping_address: string;
  payment_method: 'bKash' | 'Nagad' | 'Escrow' | 'Cash on Delivery';
  items: {
    batch_id: number;
    crop_name: string;
    farmer_name: string;
    quantity_kg: number;
    unit_price: number;
    subtotal: number;
  }[];
  total_amount: number;
  created_at: string;
  status: 'PROCESSING' | 'CONFIRMED' | 'SHIPPED';
}

