/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, FarmerProfile, CropBatch, OfficerProfile, EscrowContract, AgriTicket, LogisticsPool, DoctorAppointment } from '../types';

export const initialUsers: User[] = [
  // Farmers
  {
    user_id: 101,
    name: "Abul Hasan Miah",
    role: "FARMER",
    phone_number: "+8801712345678",
    upazila_district: "Kaliakair, Gazipur",
    joined_date: "2024-03-12T10:00:00Z"
  },
  {
    user_id: 102,
    name: "Mofizul Islam",
    role: "FARMER",
    phone_number: "+8801822334455",
    upazila_district: "Shibganj, Bogura",
    joined_date: "2025-01-05T08:30:00Z"
  },
  {
    user_id: 103,
    name: "Karim Uddin Sheikh",
    role: "FARMER",
    phone_number: "+8801599887766",
    upazila_district: "Sreemangal, Moulvibazar",
    joined_date: "2023-11-20T11:45:00Z"
  },
  // Buyers
  {
    user_id: 201,
    name: "Sabbir Ahmed (Procurement Mgr, Agora Superstores)",
    role: "BUYER",
    phone_number: "+8801911223344",
    upazila_district: "Gulshan, Dhaka",
    joined_date: "2024-05-18T14:15:00Z"
  },
  {
    user_id: 202,
    name: "Tariqul Anam (Export Director, Pran-RFL Agri-Foods)",
    role: "BUYER",
    phone_number: "+8801300998877",
    upazila_district: "Tejgaon, Dhaka",
    joined_date: "2024-08-22T09:00:00Z"
  },
  // Plant Doctors (former SAAO Agri Officers are now plant doctors)
  {
    user_id: 301,
    name: "Dr. Rafiqul Rahman (Crop Pathology)",
    role: "DOCTOR",
    phone_number: "+8801755667788",
    upazila_district: "Kaliakair, Gazipur",
    joined_date: "2022-06-15T08:00:00Z"
  },
  {
    user_id: 302,
    name: "Dr. Nusrat Jahan Akhter (Pest Control)",
    role: "DOCTOR",
    phone_number: "+8801844332211",
    upazila_district: "Shibganj, Bogura",
    joined_date: "2023-04-10T09:15:00Z"
  },
  // Agents (handling different jela / districts)
  {
    user_id: 401,
    name: "Agent Khorshed Alam (Bogura District)",
    role: "AGENT",
    phone_number: "+8801999888777",
    upazila_district: "Bogura",
    joined_date: "2024-01-10T10:00:00Z"
  },
  {
    user_id: 402,
    name: "Agent Tasnim Islam (Gazipur District)",
    role: "AGENT",
    phone_number: "+8801666555444",
    upazila_district: "Gazipur",
    joined_date: "2024-02-15T11:20:00Z"
  },
  // Admin
  {
    user_id: 501,
    name: "System Admin Mahbub (HQ Operations)",
    role: "ADMIN",
    phone_number: "+8801111222233",
    upazila_district: "Dhaka Headquarters",
    joined_date: "2023-01-01T00:00:00Z"
  }
];

export const initialFarmerProfiles: Record<number, FarmerProfile> = {
  101: {
    farmer_id: 101,
    experience_years: 12,
    farm_size_acres: 4.8,
    current_level: "Harvest Master",
    global_trust_score: 87,
    primary_crops: ["Rice", "Potato", "Onion"],
    eco_score: 84,
    on_time_delivery_rate: 94
  },
  102: {
    farmer_id: 102,
    experience_years: 3,
    farm_size_acres: 0.9,
    current_level: "Seedling Farmer",
    global_trust_score: 64,
    primary_crops: ["Jute", "Local Boro Rice"],
    eco_score: 70,
    on_time_delivery_rate: 88
  },
  103: {
    farmer_id: 103,
    experience_years: 18,
    farm_size_acres: 8.5,
    current_level: "Agro-Innovator",
    global_trust_score: 96,
    primary_crops: ["Mango", "Exotic Dragon Fruit", "Organic Capsicum"],
    eco_score: 95,
    on_time_delivery_rate: 98
  }
};

export const initialOfficerProfiles: Record<number, OfficerProfile> = {
  301: {
    officer_id: 301,
    gov_id: "DAE-SAAO-2022-8812",
    specialization: "Soil Management & Fertilizer Chemistry",
    resolved_tickets_count: 342,
    community_rating: 4.8,
    response_time_minutes: 42,
    field_visits_count: 128
  },
  302: {
    officer_id: 302,
    gov_id: "DAE-SAAO-2023-5591",
    specialization: "Pest Pathology & Entomological Control",
    resolved_tickets_count: 512,
    community_rating: 4.95,
    response_time_minutes: 25,
    field_visits_count: 245
  }
};

export const initialCropBatches: CropBatch[] = [
  {
    batch_id: 5001,
    farmer_id: 101,
    farmer_name: "Abul Hasan Miah",
    upazila_district: "Kaliakair, Gazipur",
    crop_name: "High-Yield Boro Rice (BRRI-89)",
    estimated_harvest_date: "2026-06-30",
    quantity_kg: 3400,
    base_price_per_kg: 36.5,
    officer_verified: true,
    production_grade: "A",
    certified_by_officer_id: 301,
    imageUrl: null,
    status: "AVAILABLE"
  },
  {
    batch_id: 5002,
    farmer_id: 101,
    farmer_name: "Abul Hasan Miah",
    upazila_district: "Kaliakair, Gazipur",
    crop_name: "Cardinal Red Potatoes",
    estimated_harvest_date: "2026-07-15",
    quantity_kg: 8500,
    base_price_per_kg: 24.0,
    officer_verified: false,
    production_grade: null,
    certified_by_officer_id: null,
    imageUrl: null,
    status: "AVAILABLE"
  },
  {
    batch_id: 5003,
    farmer_id: 102,
    farmer_name: "Mofizul Islam",
    upazila_district: "Shibganj, Bogura",
    crop_name: "Premium Tossa Jute (O-9897)",
    estimated_harvest_date: "2026-07-28",
    quantity_kg: 1200,
    base_price_per_kg: 68.0,
    officer_verified: false,
    production_grade: null,
    certified_by_officer_id: null,
    imageUrl: null,
    status: "AVAILABLE"
  },
  {
    batch_id: 5004,
    farmer_id: 103,
    farmer_name: "Karim Uddin Sheikh",
    upazila_district: "Sreemangal, Moulvibazar",
    crop_name: "Export-Grade Amrapali Mangos (Organic)",
    estimated_harvest_date: "2026-06-25",
    quantity_kg: 1800,
    base_price_per_kg: 135.0,
    officer_verified: true,
    production_grade: "A",
    certified_by_officer_id: 302,
    imageUrl: null,
    status: "RESERVED"
  },
  {
    batch_id: 5005,
    farmer_id: 103,
    farmer_name: "Karim Uddin Sheikh",
    upazila_district: "Sreemangal, Moulvibazar",
    crop_name: "Hydroponic Greenhouse Bell Peppers",
    estimated_harvest_date: "2026-07-05",
    quantity_kg: 800,
    base_price_per_kg: 190.0,
    officer_verified: true,
    production_grade: "A",
    certified_by_officer_id: 302,
    imageUrl: null,
    status: "AVAILABLE"
  }
];

export const initialEscrowContracts: EscrowContract[] = [
  {
    bid_id: 701,
    batch_id: 5004,
    crop_name: "Export-Grade Amrapali Mangos (Organic)",
    buyer_id: 202,
    buyer_name: "Tariqul Anam (Pran-RFL)",
    farmer_id: 103,
    farmer_name: "Karim Uddin Sheikh",
    quantity_kg: 1800,
    amount_total: 243000, // 1800 kg * 135 BDT/kg
    status: "SECURED_IN_ESCROW",
    delivery_date: "2026-06-26",
    quality_check_passed: null
  }
];

export const initialAgriTickets: AgriTicket[] = [
  {
    ticket_id: 9001,
    farmer_id: 101,
    farmer_name: "Abul Hasan Miah",
    crop_name: "Cardinal Red Potatoes",
    upazila_district: "Kaliakair, Gazipur",
    description: "Lower leaf layers are getting dark water-logged spots. Mildew powdery stuff underneath also. Need recommendation immediately so blight doesn't take my whole field.",
    imageUrl: "potato_spot.jpg",
    solved: false,
    assigned_officer_id: 301,
    response_text: null,
    ai_diagnosed_disease: "Potato Late Blight (Fungal)",
    soil_npk_advice: "Reduce rapid Nitrogen (N). Boost soluble Potash (K) to protect tubers.",
    created_at: "2026-06-21T06:40:00Z",
    solved_at: null
  }
];

export const initialLogisticsPools: LogisticsPool[] = [
  {
    pool_id: 1,
    upazila_district: "Kaliakair, Gazipur",
    crop_name: "Potatoes & Root Crops",
    farmer_count: 4,
    total_quantity_kg: 14200,
    savings_percentage: 38,
    status: "READY"
  },
  {
    pool_id: 2,
    upazila_district: "Shibganj, Bogura",
    crop_name: "High-Yield Rice & Staples",
    farmer_count: 7,
    total_quantity_kg: 28500,
    savings_percentage: 42,
    status: "READY"
  }
];

export const initialDoctorAppointments: DoctorAppointment[] = [
  {
    appointment_id: 8001,
    farmer_id: 101,
    farmer_name: "Abul Hasan Miah",
    farmer_phone: "+8801712345678",
    jela_district: "Gazipur",
    doctor_id: 301,
    doctor_name: "Dr. Rafiqul Rahman (Crop Pathology)",
    crop_name: "Cardinal Red Potatoes",
    problem_description: "Yellow spots and dark lesions appearing on leaves. Severe concerns of late blight under the unseasonal rain.",
    status: "PENDING",
    appointment_date: "2026-06-25",
    appointment_time: "10:30 AM",
    notification_sent: true,
    created_at: "2026-06-23T08:12:00Z"
  },
  {
    appointment_id: 8002,
    farmer_id: 102,
    farmer_name: "Mofizul Islam",
    farmer_phone: "+8801822334455",
    jela_district: "Bogura",
    doctor_id: 302,
    doctor_name: "Dr. Nusrat Jahan Akhter (Pest Control)",
    crop_name: "Premium Tossa Jute",
    problem_description: "Jute weevil bug infestations are feeding on younger leaf nodes. High threat of yield loss.",
    status: "ACCEPTED",
    appointment_date: "2026-06-24",
    appointment_time: "02:00 PM",
    notification_sent: true,
    created_at: "2026-06-22T09:45:00Z"
  }
];
