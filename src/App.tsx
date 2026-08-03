/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sprout,
  Users,
  HelpCircle,
  Briefcase,
  Award,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sliders,
  ChevronRight,
  FileText,
  BadgeCheck,
  MapPin,
  Truck,
  DollarSign,
  Calendar,
  RefreshCw,
  Star,
  Clock,
  Sparkles,
  Camera,
  Upload,
  Info,
  ShieldCheck,
  TrendingUp,
  Activity,
  Bell,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Layers
} from "lucide-react";
import { User, FarmerProfile, CropBatch, OfficerProfile, EscrowContract, AgriTicket, LogisticsPool, DoctorAppointment } from "./types";
import { initialUsers, initialFarmerProfiles, initialCropBatches, initialOfficerProfiles, initialEscrowContracts, initialAgriTickets, initialLogisticsPools, initialDoctorAppointments } from "./data/mockData";
import { cropSamples, CropSample } from "./data/cropSamples";

export default function App() {
  // --- Persistent State ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("sf_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [farmerProfiles, setFarmerProfiles] = useState<Record<number, FarmerProfile>>(() => {
    const saved = localStorage.getItem("sf_farmer_profiles");
    return saved ? JSON.parse(saved) : initialFarmerProfiles;
  });

  const [cropBatches, setCropBatches] = useState<CropBatch[]>(() => {
    const saved = localStorage.getItem("sf_crop_batches");
    return saved ? JSON.parse(saved) : initialCropBatches;
  });

  const [officerProfiles, setOfficerProfiles] = useState<Record<number, OfficerProfile>>(() => {
    const saved = localStorage.getItem("sf_officer_profiles");
    return saved ? JSON.parse(saved) : initialOfficerProfiles;
  });

  const [escrowContracts, setEscrowContracts] = useState<EscrowContract[]>(() => {
    const saved = localStorage.getItem("sf_escrow_contracts");
    return saved ? JSON.parse(saved) : initialEscrowContracts;
  });

  const [agriTickets, setAgriTickets] = useState<AgriTicket[]>(() => {
    const saved = localStorage.getItem("sf_agri_tickets");
    return saved ? JSON.parse(saved) : initialAgriTickets;
  });

  const [logisticsPools, setLogisticsPools] = useState<LogisticsPool[]>(() => {
    const saved = localStorage.getItem("sf_logistics_pools");
    return saved ? JSON.parse(saved) : initialLogisticsPools;
  });

  const [doctorAppointments, setDoctorAppointments] = useState<DoctorAppointment[]>(() => {
    const saved = localStorage.getItem("sf_doctor_appointments");
    return saved ? JSON.parse(saved) : initialDoctorAppointments;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem("sf_is_logged_in");
    return saved === "true";
  });

  const [activeDistrict, setActiveDistrict] = useState(() => {
    const saved = localStorage.getItem("sf_agent_active_district");
    return saved || "Gazipur";
  });

  const [systemLogs, setSystemLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem("sf_system_logs");
    return saved ? JSON.parse(saved) : [
      `[${new Date().toLocaleTimeString()}] System booted successfully.`,
      `[${new Date().toLocaleTimeString()}] BARC central database secure connection established.`,
      `[${new Date().toLocaleTimeString()}] SmartFarmer OS operational in high-trust sandbox.`,
      `[${new Date().toLocaleTimeString()}] DAE field-level API synced successfully.`
    ];
  });

  // --- Doctor Appointment Form State ---
  const [bookDoctorId, setBookDoctorId] = useState<number>(301);
  const [bookCropName, setBookCropName] = useState("Cardinal Red Potatoes");
  const [bookProblemDesc, setBookProblemDesc] = useState("");
  const [bookDate, setBookDate] = useState("2026-06-25");
  const [bookTime, setBookTime] = useState("11:00 AM");

  // --- Agent Add Farmer Form State ---
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newFarmerPhone, setNewFarmerPhone] = useState("");
  const [newFarmerDistrict, setNewFarmerDistrict] = useState("Gazipur");
  const [newFarmerExperience, setNewFarmerExperience] = useState<number | "">("");
  const [newFarmerSize, setNewFarmerSize] = useState<number | "">("");

  // --- Doctor Prescription State ---
  const [docPrescriptionNotes, setDocPrescriptionNotes] = useState("");
  const [activeAppointmentId, setActiveAppointmentId] = useState<number | null>(null);

  // --- In-App Push Notification Toast State ---
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [notificationAlertMessage, setNotificationAlertMessage] = useState("");

  // --- Admin User Manager Form State ---
  const [adminSelectedUserId, setAdminSelectedUserId] = useState<number | null>(null);
  const [adminUserFormName, setAdminUserFormName] = useState("");
  const [adminUserFormRole, setAdminUserFormRole] = useState<'FARMER' | 'AGENT' | 'DOCTOR' | 'ADMIN' | 'BUYER' | 'AGRI_OFFICER'>('FARMER');
  const [adminUserFormPhone, setAdminUserFormPhone] = useState("");
  const [adminUserFormDistrict, setAdminUserFormDistrict] = useState("");
  const [adminShowUserForm, setAdminShowUserForm] = useState(false);

  // --- Active Session impersonation ---
  const [activeUser, setActiveUser] = useState<User>(() => {
    const saved = localStorage.getItem("sf_active_user");
    return saved ? JSON.parse(saved) : initialUsers[0]; 
  });

  // --- UI Controls ---
  const [searchText, setSearchText] = useState("");
  const [cropFilter, setCropFilter] = useState("ALL");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [verificationFilter, setVerificationFilter] = useState("ALL");

  // --- Diagnosis Workspace State ---
  const [selectedSample, setSelectedSample] = useState<CropSample | null>(cropSamples[0]);
  const [customFile, setCustomFile] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [customCropName, setCustomCropName] = useState("Potato");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [activeReport, setActiveReport] = useState<any | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [ticketDescription, setTicketDescription] = useState("");

  // --- Add Listing Form State ---
  const [newCropName, setNewCropName] = useState("");
  const [newCropQuantity, setNewCropQuantity] = useState<number | "">("");
  const [newCropPrice, setNewCropPrice] = useState<number | "">("");
  const [newCropHarvestDate, setNewCropHarvestDate] = useState("");
  const [listError, setListError] = useState("");
  const [listSuccess, setListSuccess] = useState(false);

  // --- Officer Action Form State ---
  const [officerResponseText, setOfficerResponseText] = useState("");
  const [officerGradeInput, setOfficerGradeInput] = useState<"A" | "B" | "C">("A");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  // --- Login Portal State ---
  const [selectedLoginUserId, setSelectedLoginUserId] = useState<number | null>(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [showAlternativeUsers, setShowAlternativeUsers] = useState(false);

  // --- Sync with localStorage ---
  useEffect(() => {
    localStorage.setItem("sf_users", JSON.stringify(users));
    localStorage.setItem("sf_farmer_profiles", JSON.stringify(farmerProfiles));
    localStorage.setItem("sf_crop_batches", JSON.stringify(cropBatches));
    localStorage.setItem("sf_officer_profiles", JSON.stringify(officerProfiles));
    localStorage.setItem("sf_escrow_contracts", JSON.stringify(escrowContracts));
    localStorage.setItem("sf_agri_tickets", JSON.stringify(agriTickets));
    localStorage.setItem("sf_logistics_pools", JSON.stringify(logisticsPools));
    localStorage.setItem("sf_doctor_appointments", JSON.stringify(doctorAppointments));
    localStorage.setItem("sf_is_logged_in", String(isLoggedIn));
    localStorage.setItem("sf_agent_active_district", activeDistrict);
    localStorage.setItem("sf_system_logs", JSON.stringify(systemLogs));
    localStorage.setItem("sf_active_user", JSON.stringify(activeUser));
  }, [users, farmerProfiles, cropBatches, officerProfiles, escrowContracts, agriTickets, logisticsPools, doctorAppointments, isLoggedIn, activeDistrict, systemLogs, activeUser]);

  // --- Helpers ---
  const getFarmerProfile = (id: number): FarmerProfile | undefined => farmerProfiles[id];
  const getOfficerProfile = (id: number): OfficerProfile | undefined => officerProfiles[id];

  // --- Reset Simulation To Seed ---
  const handleResetSimulation = () => {
    if (confirm("Reset simulation data back to factory defaults?")) {
      localStorage.clear();
      setUsers(initialUsers);
      setFarmerProfiles(initialFarmerProfiles);
      setCropBatches(initialCropBatches);
      setOfficerProfiles(initialOfficerProfiles);
      setEscrowContracts(initialEscrowContracts);
      setAgriTickets(initialAgriTickets);
      setLogisticsPools(initialLogisticsPools);
      setDoctorAppointments(initialDoctorAppointments);
      setIsLoggedIn(false);
      setActiveDistrict("Gazipur");
      setSystemLogs([
        `[${new Date().toLocaleTimeString()}] System booted successfully.`,
        `[${new Date().toLocaleTimeString()}] BARC central database secure connection established.`,
        `[${new Date().toLocaleTimeString()}] SmartFarmer OS operational in high-trust sandbox.`,
        `[${new Date().toLocaleTimeString()}] DAE field-level API synced successfully.`
      ]);
      setActiveUser(initialUsers[0]);
      setActiveReport(null);
      setHasScanned(false);
      setCustomFile(null);
      setSelectedSample(cropSamples[0]);
      alert("Simulation data completely reset successfully!");
    }
  };

  const addLog = (msg: string) => {
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const triggerNotificationToast = (msg: string) => {
    setNotificationAlertMessage(msg);
    setShowNotificationAlert(true);
    setTimeout(() => {
      setShowNotificationAlert(false);
    }, 4500);
  };

  const handleBookDoctorAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookProblemDesc.trim()) {
      alert("Please describe the crop problem before booking.");
      return;
    }
    const doc = users.find(u => u.user_id === Number(bookDoctorId));
    const newApptId = Date.now();
    const newAppt: DoctorAppointment = {
      appointment_id: newApptId,
      farmer_id: activeUser.user_id,
      farmer_name: activeUser.name,
      farmer_phone: activeUser.phone_number,
      jela_district: activeUser.upazila_district.split(",").pop()?.trim() || activeUser.upazila_district,
      doctor_id: Number(bookDoctorId),
      doctor_name: doc ? doc.name : "Agri-Doctor",
      crop_name: bookCropName,
      problem_description: bookProblemDesc,
      status: "PENDING",
      appointment_date: bookDate,
      appointment_time: bookTime,
      notification_sent: false,
      created_at: new Date().toISOString()
    };
    setDoctorAppointments(prev => [newAppt, ...prev]);
    addLog(`Farmer '${activeUser.name}' booked appointment #${newApptId} with '${newAppt.doctor_name}'`);
    triggerNotificationToast(`🔔 Appointment Request Sent! Dr. ${newAppt.doctor_name.split(" ").pop()} received your Crop Alert.`);
    setBookProblemDesc("");
  };

  const handleDoctorAction = (apptId: number, status: 'ACCEPTED' | 'DECLINED' | 'COMPLETED', notes?: string) => {
    setDoctorAppointments(prev => prev.map(a => {
      if (a.appointment_id === apptId) {
        return {
          ...a,
          status,
          prescription_notes: notes !== undefined ? notes : a.prescription_notes
        };
      }
      return a;
    }));
    const appt = doctorAppointments.find(a => a.appointment_id === apptId);
    if (status === 'ACCEPTED') {
      addLog(`Doctor '${activeUser.name}' accepted appointment #${apptId} for '${appt?.farmer_name}'`);
      triggerNotificationToast(`✓ Consultation accepted! Patient '${appt?.farmer_name}' has been notified.`);
    } else if (status === 'DECLINED') {
      addLog(`Doctor '${activeUser.name}' declined appointment #${apptId}`);
      triggerNotificationToast(`✗ Consultation declined.`);
    } else if (status === 'COMPLETED') {
      addLog(`Doctor '${activeUser.name}' issued prescription notes and completed appointment #${apptId}`);
      triggerNotificationToast(`💊 Advisory Prescription Issued! Consultation completed successfully.`);
    }
  };

  const handleAgentVerifyListing = (batchId: number, grade: 'A' | 'B' | 'C') => {
    setCropBatches(prev => prev.map(b => {
      if (b.batch_id === batchId) {
        return {
          ...b,
          officer_verified: true,
          production_grade: grade,
          certified_by_officer_id: activeUser.user_id
        };
      }
      return b;
    }));
    const batch = cropBatches.find(b => b.batch_id === batchId);
    if (batch) {
      setFarmerProfiles(prev => {
         const current = prev[batch.farmer_id];
         if (current) {
           return {
             ...prev,
             [batch.farmer_id]: {
               ...current,
               global_trust_score: Math.min(100, current.global_trust_score + 10)
             }
           };
         }
         return prev;
      });
      addLog(`Agent '${activeUser.name}' verified listing #${batchId} (${batch.crop_name}) as Grade ${grade}`);
      triggerNotificationToast(`✓ Certified Crop Listing #${batchId} as DAE Grade '${grade}'! Trust score increased.`);
    }
  };

  const handleAgentDispatchLogistics = (jela: string) => {
    setCropBatches(prev => prev.map(b => {
      if (b.upazila_district.toLowerCase().includes(jela.toLowerCase()) && b.status === "AVAILABLE") {
        return { ...b, status: "RESERVED" };
      }
      return b;
    }));
    addLog(`Agent '${activeUser.name}' dispatched regional logistics cargo pool for district: ${jela}`);
    triggerNotificationToast(`🚚 District Freight cargo dispatched! Geographic pooling savings locked.`);
  };

  const handleAgentRegisterFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmerName.trim() || !newFarmerPhone.trim() || !newFarmerExperience || !newFarmerSize) {
      alert("Please enter all details for registering a local farmer.");
      return;
    }
    const newId = Date.now();
    const newUser: User = {
      user_id: newId,
      name: newFarmerName,
      role: "FARMER",
      phone_number: newFarmerPhone,
      upazila_district: `Kaliakair, ${activeDistrict}`,
      joined_date: new Date().toISOString()
    };
    const newProfile: FarmerProfile = {
      farmer_id: newId,
      experience_years: Number(newFarmerExperience),
      farm_size_acres: Number(newFarmerSize),
      current_level: Number(newFarmerExperience) > 10 ? "Agro-Innovator" : Number(newFarmerExperience) > 5 ? "Harvest Master" : "Seedling Farmer",
      global_trust_score: 75,
      primary_crops: ["Rice", "Potato"],
      eco_score: 80,
      on_time_delivery_rate: 90
    };
    setUsers(prev => [...prev, newUser]);
    setFarmerProfiles(prev => ({ ...prev, [newId]: newProfile }));
    addLog(`Agent '${activeUser.name}' registered new smallholder farmer '${newFarmerName}' in district '${activeDistrict}'`);
    triggerNotificationToast(`🌾 New Farmer registered successfully under active Jela portfolio!`);
    setNewFarmerName("");
    setNewFarmerPhone("");
    setNewFarmerExperience("");
    setNewFarmerSize("");
  };

  const handleAdminSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUserFormName.trim() || !adminUserFormPhone.trim() || !adminUserFormDistrict.trim()) {
      alert("Please enter Name, Phone, and Upazila / District.");
      return;
    }
    if (adminSelectedUserId) {
      setUsers(prev => prev.map(u => {
        if (u.user_id === adminSelectedUserId) {
          return {
            ...u,
            name: adminUserFormName,
            role: adminUserFormRole,
            phone_number: adminUserFormPhone,
            upazila_district: adminUserFormDistrict
          };
        }
        return u;
      }));
      addLog(`Admin updated user ID #${adminSelectedUserId} (${adminUserFormName})`);
      triggerNotificationToast(`✓ User ID #${adminSelectedUserId} updated successfully!`);
    } else {
      const newId = Date.now();
      const newUser: User = {
        user_id: newId,
        name: adminUserFormName,
        role: adminUserFormRole,
        phone_number: adminUserFormPhone,
        upazila_district: adminUserFormDistrict,
        joined_date: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      addLog(`Admin registered new user ID #${newId} (${adminUserFormName})`);
      triggerNotificationToast(`✓ User '${adminUserFormName}' created!`);
    }
    setAdminShowUserForm(false);
    setAdminSelectedUserId(null);
    setAdminUserFormName("");
    setAdminUserFormPhone("");
    setAdminUserFormDistrict("");
  };

  const handleAdminDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to delete this user? All associate data will be decoupled.")) {
      setUsers(prev => prev.filter(u => u.user_id !== userId));
      addLog(`Admin deleted user ID #${userId}`);
      triggerNotificationToast("✓ User deleted successfully.");
    }
  };

  // --- Handle Custom Leaf Upload ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        setCustomFile({
          base64: base64String,
          mimeType: file.type,
          name: file.name
        });
        setSelectedSample(null); // Deselect templates
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Run Crop AI diagnostics calling the server ---
  const handleDiagnoseCrop = async () => {
    setIsScanning(true);
    setHasScanned(true);
    setActiveReport(null);

    const steps = [
      "Extracting leaf pigmentation profiles...",
      "Analyzing pathology patterns via server-side vision routing...",
      "Matching spatial agricultural stress guidelines...",
      "Compiling N-P-K recommendation values and grades..."
    ];

    let currentStep = 0;
    setScanProgress(steps[0]);

    const progressInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanProgress(steps[currentStep]);
      }
    }, 600);

    const payload = selectedSample 
      ? { imageBase64: selectedSample.base64, mimeType: selectedSample.mimeType, cropName: selectedSample.cropName }
      : customFile 
        ? { imageBase64: customFile.base64, mimeType: customFile.mimeType, cropName: customCropName }
        : null;

    if (!payload) {
      clearInterval(progressInterval);
      setScanProgress("Failed: Please select a pre-set specimen or upload your own leaf.");
      setIsScanning(false);
      return;
    }

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      clearInterval(progressInterval);

      if (data.report) {
        setActiveReport(data.report);
      } else {
        throw new Error("Diagnosis yielded empty results");
      }
    } catch (err) {
      console.error(err);
      clearInterval(progressInterval);
      setScanProgress("Connection failed. Routing to intelligent local Agricultural backup engine...");
      
      // Fallback
      setTimeout(() => {
        const fallbackReport = {
          healthy: false,
          issueName: "Bacterial Foliage Blight (Intelligent Fallback)",
          pathogen: "Xanthomonas Oryzae Complex",
          confidence: 89,
          summary: "Moderate cell wall deterioration found along the primary vascular structure. Spreads quickly under unseasonally humid monsoon conditions with waterlogged roots.",
          soilRecommendations: {
            nitrogen: "Immediate 50% Reduction. Free nitrate ions feed the bacterial colony.",
            phosphorus: "Maintain normal levels to sustain cell replication.",
            potassium: "Increase Potash (K) by 15% to reinforce cellulose cell walls.",
            moisture: "Drain standing field water to lower relative plant microclimate humidity."
          },
          actionItems: [
            "Prune infected leaf tips using sterilized shears to prevent water transmission.",
            "Apply contact eco-friendly copper fungicides.",
            "Increase plant rows distance configuration in next rotation cycle of crops."
          ],
          productionGrade: "B",
          isUrgent: true
        };
        setActiveReport(fallbackReport);
      }, 800);
    } finally {
      setIsScanning(false);
    }
  };

  // --- Farmer Submit Helpline Ticket ---
  const handleSubmitTicket = () => {
    if (!descriptionIsEmptyOrInvalid()) {
      const newTicket: AgriTicket = {
        ticket_id: Date.now(),
        farmer_id: activeUser.user_id,
        farmer_name: activeUser.name,
        crop_name: selectedSample ? selectedSample.cropName : customCropName,
        upazila_district: activeUser.upazila_district,
        description: ticketDescription,
        imageUrl: selectedSample ? `${selectedSample.id}.jpg` : "custom_upload.jpg",
        solved: false,
        assigned_officer_id: activeUser.upazila_district.includes("Gazipur") ? 301 : 302, // Auto route based on Upazila!
        response_text: null,
        ai_diagnosed_disease: activeReport ? activeReport.issueName : "Unknown Fungal Stress",
        soil_npk_advice: activeReport ? `Reduce N, Increase K. ${activeReport.soilRecommendations.moisture}` : null,
        created_at: new Date().toISOString(),
        solved_at: null
      };

      setAgriTickets([newTicket, ...agriTickets]);
      setTicketDescription("");
      alert(`Emergency Helpline Ticket raised successfully with local Upazila SAAO Office! Case auto-assigned.`);
    }
  };

  const descriptionIsEmptyOrInvalid = () => {
    return !ticketDescription.trim();
  };

  // --- Farmer Lists New Crop Yield ---
  const handleListCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName || !newCropQuantity || !newCropPrice || !newCropHarvestDate) {
      setListError("Please fill out all crop listing parameters.");
      return;
    }

    const newBatch: CropBatch = {
      batch_id: Date.now(),
      farmer_id: activeUser.user_id,
      farmer_name: activeUser.name,
      upazila_district: activeUser.upazila_district,
      crop_name: newCropName,
      estimated_harvest_date: newCropHarvestDate,
      quantity_kg: Number(newCropQuantity),
      base_price_per_kg: Number(newCropPrice),
      officer_verified: false,
      production_grade: null,
      certified_by_officer_id: null,
      imageUrl: null,
      status: "AVAILABLE"
    };

    setCropBatches([newBatch, ...cropBatches]);
    setNewCropName("");
    setNewCropQuantity("");
    setNewCropPrice("");
    setNewCropHarvestDate("");
    setListError("");
    setListSuccess(true);
    setTimeout(() => setListSuccess(false), 3000);
  };

  // --- Farmer triggers Delivery for Crop ---
  const handleFarmerDeliver = (bidId: number) => {
    setEscrowContracts(prev => prev.map(c => {
      if (c.bid_id === bidId) {
        return { ...c, status: "SECURED_IN_ESCROW", delivery_date: new Date().toLocaleDateString() };
      }
      return c;
    }));
    alert("Produce shipped! Awaiting Buyer's arrival Quality Check and escrow release clearance.");
  };

  // --- Buyer Places B2B Bidding Secure Deposit ---
  const handleBuyerPlaceEscrow = (batch: CropBatch) => {
    const totalAmount = batch.quantity_kg * batch.base_price_per_kg;
    const newContract: EscrowContract = {
      bid_id: Date.now(),
      batch_id: batch.batch_id,
      crop_name: batch.crop_name,
      buyer_id: activeUser.user_id,
      buyer_name: activeUser.name,
      farmer_id: batch.farmer_id,
      farmer_name: batch.farmer_name,
      quantity_kg: batch.quantity_kg,
      amount_total: totalAmount,
      status: "SECURED_IN_ESCROW",
      delivery_date: null,
      quality_check_passed: null
    };

    // Update batch to Reserved
    setCropBatches(prev => prev.map(b => b.batch_id === batch.batch_id ? { ...b, status: "RESERVED" } : b));
    setEscrowContracts([newContract, ...escrowContracts]);
    alert(`B2B Escrow Locked! ${totalAmount.toLocaleString()} BDT secures this batch. Logistics pooling routed.`);
  };

  // --- Buyer Release Escrow Funds to Farmer ---
  const handleBuyerReleaseFunds = (bidId: number, passQualityCheck: boolean) => {
    setEscrowContracts(prev => prev.map(c => {
      if (c.bid_id === bidId) {
        // Complete the crop batch
        setCropBatches(bPrev => bPrev.map(b => b.batch_id === c.batch_id ? { ...b, status: "COMPLETED" } : b));
        
        // Boost Farmer trust score on successful escrow release!
        if (passQualityCheck) {
          setFarmerProfiles(fPrev => {
            const current = fPrev[c.farmer_id];
            if (current) {
              return {
                ...fPrev,
                [c.farmer_id]: {
                  ...current,
                  global_trust_score: Math.min(100, current.global_trust_score + 4),
                  on_time_delivery_rate: Math.min(100, current.on_time_delivery_rate + 2)
                }
              };
            }
            return fPrev;
          });
        }

        return {
          ...c,
          status: passQualityCheck ? "RELEASED_TO_FARMER" : "REFUNDED_TO_BUYER",
          quality_check_passed: passQualityCheck
        };
      }
      return c;
    }));
    
    alert(passQualityCheck 
      ? "Quality check passed! Escrow funds released instantly to the Farmer's digital account."
      : "Quality audit flagged! Escrow funds on hold for Upazila agricultural dispute resolution."
    );
  };

  // --- Officer response and Quality certification signoff ---
  const handleOfficerResolveTicket = (ticket: AgriTicket) => {
    if (!officerResponseText.trim()) {
      alert("Please provide agro-management expert advice comments.");
      return;
    }

    // 1. Solve the ticket
    setAgriTickets(prev => prev.map(t => {
      if (t.ticket_id === ticket.ticket_id) {
        return {
          ...t,
          solved: true,
          response_text: officerResponseText,
          solved_at: new Date().toISOString()
        };
      }
      return t;
    }));

    // 2. Locate the farmer's pending self-declared crop batches of that crop type to certify them!
    setCropBatches(prev => prev.map(b => {
      if (b.farmer_id === ticket.farmer_id && b.crop_name.toLowerCase().includes(ticket.crop_name.toLowerCase())) {
        return {
          ...b,
          officer_verified: true,
          production_grade: officerGradeInput,
          certified_by_officer_id: activeUser.user_id
        };
      }
      return b;
    }));

    // 3. Increment Officer resolved count and Farmer global_trust_score (from SAAO verification)
    setOfficerProfiles(prev => {
      const current = prev[activeUser.user_id];
      if (current) {
        return {
          ...prev,
          [activeUser.user_id]: {
            ...current,
            resolved_tickets_count: current.resolved_tickets_count + 1,
            field_visits_count: current.field_visits_count + 1
          }
        };
      }
      return prev;
    });

    setFarmerProfiles(fPrev => {
      const current = fPrev[ticket.farmer_id];
      if (current) {
        return {
          ...fPrev,
          [ticket.farmer_id]: {
            ...current,
            global_trust_score: Math.min(100, current.global_trust_score + 8) // big boost for certified fields
          }
        };
      }
      return fPrev;
    });

    setOfficerResponseText("");
    setSelectedTicketId(null);
    alert(`Ticket solved successfully! Recommended Grade '${officerGradeInput}' and high-trust certification badge stamped on farmer's listings.`);
  };


  // --- Filter marketplace listings ---
  const filteredCrops = cropBatches.filter(batch => {
    // Only show AVAILABLE or RESERVED on the B2B marketplace feed
    if (batch.status === "COMPLETED") return false;

    // Search filter
    const matchesSearch = batch.crop_name.toLowerCase().includes(searchText.toLowerCase()) ||
                          batch.farmer_name.toLowerCase().includes(searchText.toLowerCase()) ||
                          batch.upazila_district.toLowerCase().includes(searchText.toLowerCase());

    // Category filter
    const matchesCrop = cropFilter === "ALL" || batch.crop_name.toLowerCase().includes(cropFilter.toLowerCase());

    // District filter
    const matchesDistrict = districtFilter === "ALL" || batch.upazila_district.toLowerCase().includes(districtFilter.toLowerCase());

    // Verification filter
    const matchesVerification = verificationFilter === "ALL" || 
      (verificationFilter === "VERIFIED" && batch.officer_verified) ||
      (verificationFilter === "UNVERIFIED" && !batch.officer_verified);

    return matchesSearch && matchesCrop && matchesDistrict && matchesVerification;
  });

  // --- Login Portal Logic & Verification ---
  const featuredPeople = [
    {
      id: 101,
      name: "Abul Hasan Miah",
      role: "FARMER" as const,
      badge: "SMALLHOLDER PRODUCER",
      district: "Kaliakair, Gazipur",
      pin: "1234",
      avatar: "🌾",
      bgGradient: "from-emerald-950/40 to-emerald-900/10",
      accentColor: "#10B981",
      skills: ["Manage crop inventory & prices", "AI leaf diagnostic scans", "Book plant doctor consultation"]
    },
    {
      id: 201,
      name: "Sabbir Ahmed",
      role: "BUYER" as const,
      badge: "AGORA SUPERSTORE BUYER",
      district: "Gulshan, Dhaka",
      pin: "2345",
      avatar: "🏢",
      bgGradient: "from-orange-950/40 to-orange-900/10",
      accentColor: "#F97316",
      skills: ["Secure wholesale bulk crop lots", "Fund smart escrow contracts", "Coordinate cold-chain logistics"]
    },
    {
      id: 301,
      name: "Dr. Rafiqul Rahman",
      role: "DOCTOR" as const,
      badge: "CLINICAL PATHOLOGIST",
      district: "Kaliakair, Gazipur",
      pin: "3456",
      avatar: "🔬",
      bgGradient: "from-sky-950/40 to-sky-900/10",
      accentColor: "#0EA5E9",
      skills: ["Diagnose farmer distress alerts", "Prescribe clinical recovery notes", "Issue official quality badges"]
    },
    {
      id: 401,
      name: "Agent Khorshed Alam",
      role: "AGENT" as const,
      badge: "DISTRICT COORDINATOR",
      district: "Bogura District",
      pin: "4567",
      avatar: "📦",
      bgGradient: "from-purple-950/40 to-purple-900/10",
      accentColor: "#A855F7",
      skills: ["Onboard smallholder producers", "Grade live harvest bundles", "Dispatch freight hauling fleet"]
    }
  ];

  const handleSelectLoginUser = (userId: number) => {
    setSelectedLoginUserId(userId);
    setEnteredPin("");
    setLoginError("");
  };

  const handleLoginSubmit = (userToLogin: User, pinEntered: string) => {
    let expectedPin = "1234";
    if (userToLogin.user_id === 101) expectedPin = "1234";
    else if (userToLogin.user_id === 201) expectedPin = "2345";
    else if (userToLogin.user_id === 301) expectedPin = "3456";
    else if (userToLogin.user_id === 401) expectedPin = "4567";
    else expectedPin = "0000"; // fallback for alternative users

    if (pinEntered === expectedPin) {
      setIsLoginLoading(true);
      setLoginError("");
      setTimeout(() => {
        setActiveUser(userToLogin);
        setIsLoggedIn(true);
        localStorage.setItem("sf_is_logged_in", "true");
        localStorage.setItem("sf_active_user", JSON.stringify(userToLogin));
        setIsLoginLoading(false);
        setEnteredPin("");
        setSelectedLoginUserId(null);
        addLog(`System Access Granted: '${userToLogin.name}' (${userToLogin.role}) authenticated successfully.`);
        triggerNotificationToast(`✓ Access Granted: Welcome back, ${userToLogin.name}!`);
      }, 800);
    } else {
      setLoginError("Invalid 4-digit security PIN. Please try again.");
      triggerNotificationToast("✗ Access Denied: Incorrect credentials.");
    }
  };

  const handleKeypadPress = (val: string) => {
    setLoginError("");
    if (val === "CLEAR") {
      setEnteredPin("");
    } else if (val === "DELETE") {
      setEnteredPin(prev => prev.slice(0, -1));
    } else {
      if (enteredPin.length < 4) {
        const nextPin = enteredPin + val;
        setEnteredPin(nextPin);
        
        // Auto-submit if 4 digits are typed!
        if (nextPin.length === 4) {
          const matchedUser = users.find(u => u.user_id === selectedLoginUserId);
          if (matchedUser) {
            handleLoginSubmit(matchedUser, nextPin);
          }
        }
      }
    }
  };

  if (!isLoggedIn) {
    const activeSelectedUserObj = users.find(u => u.user_id === selectedLoginUserId);
    const activeFeaturedObj = featuredPeople.find(p => p.id === selectedLoginUserId);

    return (
      <div id="login-portal-container" className="min-h-screen bg-[#0F160F] text-white flex flex-col justify-between p-6 relative overflow-hidden font-sans selection:bg-[#F97316]/30">
        
        {/* Animated ambient background spots */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Global Toast Alert */}
        {showNotificationAlert && (
          <div className="fixed top-5 right-5 z-50 bg-[#2D4F1E] border-2 border-emerald-500/30 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-slideIn">
            <div className="p-1.5 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Sprout className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-xs font-bold font-sans">{notificationAlertMessage}</p>
          </div>
        )}

        {/* HEADER */}
        <header className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#F97316] rounded-2xl text-white shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight uppercase flex items-center gap-2 font-sans text-white">
                SmartFarmer OS <span className="text-[9px] bg-white/10 text-[#F97316] font-extrabold px-2 py-0.5 rounded-full border border-white/10 uppercase font-mono tracking-wider">v4.2.0</span>
              </h1>
              <p className="text-xs text-gray-400">Agricultural Market Exchange & Diagnostics Terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse animate-duration-1000"></span>
            <span>Federated Network Security Active</span>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="max-w-6xl mx-auto w-full my-auto py-10 flex flex-col items-center justify-center gap-8">
          
          {selectedLoginUserId === null ? (
            // VIEW 1: DISPLAY 4 PERSONA CARDS
            <div className="w-full space-y-8 animate-fadeIn">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl"> E-Governance & Market Exchange Portal</h2>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                  Choose one of the 4 key actors below to log into your workstation session. Enter their designated security passcode to authenticate and retrieve local files.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPeople.map(person => {
                  const dbUser = users.find(u => u.user_id === person.id) || { name: person.name, role: person.role, upazila_district: person.district, phone_number: "" };
                  return (
                    <div
                      key={person.id}
                      className="bg-white/[0.02] border-2 border-white/5 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between gap-6 hover:bg-white/[0.04] hover:scale-[1.02] relative group overflow-hidden"
                    >
                      {/* Decorative subtle gradient card glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${person.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl p-2.5 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">{person.avatar}</span>
                          <span className="text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border bg-white/5 text-gray-300 border-white/10 font-sans">
                            {person.badge}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors duration-200">{person.name}</h3>
                          <p className="text-xs text-gray-400 flex items-center gap-1 font-sans">
                            <MapPin className="w-3.5 h-3.5 text-red-500/70" /> {person.district}
                          </p>
                        </div>

                        <ul className="space-y-2 border-t border-white/5 pt-4">
                          {person.skills.map((skill, idx) => (
                            <li key={idx} className="text-xs text-gray-300 flex items-start gap-2 font-sans font-medium">
                              <span className="text-emerald-500 shrink-0 mt-0.5 font-sans">✓</span>
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2.5 relative z-10 border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold font-mono px-1">
                          <span>Passcode Key:</span>
                          <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/15">PIN {person.pin}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              // Fast absolute direct bypass login
                              handleLoginSubmit(dbUser as User, person.pin);
                            }}
                            className="py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors text-center border border-white/5"
                          >
                            ⚡ Direct Log In
                          </button>
                          <button
                            onClick={() => handleSelectLoginUser(person.id)}
                            className="py-2.5 bg-[#2D4F1E] hover:bg-[#3d6b28] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-colors text-center"
                          >
                            🔑 Enter PIN
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // VIEW 2: SECURITY KEYPAD PIN INPUT VIEW
            <div className="max-w-md w-full bg-white/[0.02] border-2 border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              
              {/* Back button */}
              <button
                onClick={() => setSelectedLoginUserId(null)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer transition-colors border border-white/5 bg-white/5 px-3 py-1.5 rounded-xl self-start"
              >
                ← Back to Personnel List
              </button>

              <div className="text-center space-y-2">
                <div className="text-4xl mx-auto py-2">
                  {activeFeaturedObj?.avatar || "🔑"}
                </div>
                <h3 className="text-xl font-extrabold text-white">Workstation Authentication</h3>
                <p className="text-xs text-gray-400 font-sans">
                  Confirm access credentials for <strong className="text-white">{activeSelectedUserObj?.name}</strong>
                </p>
                <div className="inline-block bg-white/5 px-3 py-1 rounded-full text-[10px] text-gray-400 font-bold border border-white/5 uppercase font-sans">
                  {activeFeaturedObj?.badge}
                </div>
              </div>

              {/* Pin indicator dots */}
              <div className="space-y-2">
                <div className="flex justify-center gap-4 py-4">
                  {[0, 1, 2, 3].map((idx) => {
                    const isFilled = enteredPin.length > idx;
                    return (
                      <div
                        key={idx}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                          isFilled
                            ? "bg-amber-400 border-amber-400 scale-125 shadow-md shadow-amber-400/20"
                            : "border-gray-600 bg-transparent"
                        }`}
                      />
                    );
                  })}
                </div>
                
                {loginError && (
                  <p className="text-center text-xs text-red-400 font-bold font-sans flex items-center justify-center gap-1.5 bg-red-950/20 p-2.5 rounded-xl border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {loginError}
                  </p>
                )}
              </div>

              {/* Interactive Keypad */}
              <div className="grid grid-cols-3 gap-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className="aspect-square flex items-center justify-center text-lg font-bold bg-white/5 hover:bg-white/10 text-white rounded-2xl cursor-pointer active:scale-95 transition-all border border-white/5"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleKeypadPress("CLEAR")}
                  className="flex items-center justify-center text-xs font-bold text-red-400 bg-red-950/20 hover:bg-red-900/30 rounded-2xl cursor-pointer active:scale-95 transition-all border border-red-500/10"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleKeypadPress("0")}
                  className="aspect-square flex items-center justify-center text-lg font-bold bg-white/5 hover:bg-white/10 text-white rounded-2xl cursor-pointer active:scale-95 transition-all border border-white/5"
                >
                  0
                </button>
                <button
                  onClick={() => handleKeypadPress("DELETE")}
                  className="flex items-center justify-center text-xs font-bold text-gray-300 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer active:scale-95 transition-all border border-white/5"
                >
                  Delete
                </button>
              </div>

              {/* Keytip hint block */}
              <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-2xl text-center text-[11px] text-amber-300/80 font-sans">
                <span className="font-bold font-sans text-amber-400">🔑 System security hint:</span> The designated login PIN for {activeSelectedUserObj?.name.split(" ")[0]} is <strong className="text-amber-400 font-mono font-bold text-xs underline decoration-dotted">{activeFeaturedObj?.pin}</strong>.
              </div>

              {/* Loader overlay */}
              {isLoginLoading && (
                <div className="absolute inset-0 bg-[#0F160F]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-300 font-bold font-sans">Verifying security signature...</p>
                </div>
              )}
            </div>
          )}

          {/* ALTERNATIVE LOGIN DROP-DOWN PANEL */}
          <div className="w-full max-w-lg bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center space-y-3">
            <button
              onClick={() => setShowAlternativeUsers(!showAlternativeUsers)}
              className="text-xs text-gray-400 hover:text-white font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 mx-auto font-sans"
            >
              <span>👤 {showAlternativeUsers ? "Hide" : "Show"} alternative system registered personnel</span>
              <span className="text-[10px] text-gray-500">({users.length - 4} other profiles)</span>
            </button>

            {showAlternativeUsers && (
              <div className="pt-3 border-t border-white/5 grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {users.filter(u => !featuredPeople.some(fp => fp.id === u.user_id)).map(altUser => (
                  <div
                    key={altUser.user_id}
                    onClick={() => {
                      // Login immediately as alternative user
                      handleLoginSubmit(altUser, "0000");
                    }}
                    className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent rounded-xl cursor-pointer transition-all text-left text-xs font-sans group"
                  >
                    <div>
                      <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors font-sans">{altUser.name}</h4>
                      <p className="text-[10px] text-gray-400 font-sans">{altUser.upazila_district}</p>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-full border border-white/10 text-gray-400 font-mono">
                      {altUser.role} (PIN: 0000)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto w-full text-center border-t border-white/5 pt-6 text-[10px] text-gray-500 font-semibold font-mono">
          SMART FARMER DECENTRALIZED PLATFORM • CO-OPERATIVE SYSTEM FEDERATION
        </footer>

      </div>
    );
  }

  return (
    <div id="smart-farmer-root" className="min-h-screen bg-[#F4F1EA] text-[#1A2A1A] font-sans selection:bg-[#2D4F1E]/20 selection:text-[#1A2A1A] pb-12">
      
      {/* --- TOP BANNER / ECOSYSTEM SIMULATOR CONSOLE --- */}
      <section id="simulator-console" className="sticky top-2 z-45 mx-4 my-2 bg-[#2D4F1E] text-white p-5 rounded-3xl shadow-md border border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#F97316] rounded-2xl text-white shadow-sm flex items-center justify-center">
              <Sprout className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white uppercase flex items-center gap-1.5 font-sans">
                SmartFarmer OS <span className="text-[10px] bg-white/10 text-[#F97316] font-extrabold px-2 py-0.5 rounded-full border border-white/25 uppercase font-mono tracking-wider">v4.2.0</span>
              </h1>
              <p className="text-[11px] text-white/80">Integrated Agricultural Logistics & Cultivation Ecosystem</p>
            </div>
          </div>

          <div id="role-selector-bar" className="flex flex-wrap items-center bg-white/5 p-1.5 rounded-2xl border border-white/10 gap-1 font-sans">
            <span className="text-[11px] font-bold text-white/60 px-2 uppercase tracking-wide">Acting As:</span>
            
            {/* Farmers */}
            {users.filter(u => u.role === "FARMER").map(f => (
              <button
                key={f.user_id}
                id={`role-btn-farmer-${f.user_id}`}
                onClick={() => { setActiveUser(f); setActiveReport(null); setHasScanned(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeUser.user_id === f.user_id
                    ? "bg-white text-[#2D4F1E] shadow-sm font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>🌾</span> {f.name.split(" ")[0]}
              </button>
            ))}

            {/* Buyer */}
            {users.filter(u => u.role === "BUYER").slice(0, 1).map(b => (
              <button
                key={b.user_id}
                id={`role-btn-buyer-${b.user_id}`}
                onClick={() => { setActiveUser(b); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeUser.user_id === b.user_id
                    ? "bg-[#F97316] text-white shadow-sm font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>🏢</span> Buyer: Sabbir
              </button>
            ))}

            {/* Officer */}
            {users.filter(u => u.role === "AGRI_OFFICER").slice(0, 1).map(o => (
              <button
                key={o.user_id}
                id={`role-btn-officer-${o.user_id}`}
                onClick={() => { setActiveUser(o); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeUser.user_id === o.user_id
                    ? "bg-sky-500 text-white shadow-sm font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>🔬</span> Officer: Nusrat
              </button>
            ))}
          </div>

          <button
            id="reset-simulation-btn"
            onClick={handleResetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 text-white/90 rounded-xl hover:bg-red-500/20 hover:text-red-200 border border-white/10 font-mono transition-all duration-200 cursor-pointer"
            title="Wipe LocalStorage and reset profiles"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>

          <button
            id="logout-btn"
            onClick={() => {
              setIsLoggedIn(false);
              localStorage.setItem("sf_is_logged_in", "false");
              setEnteredPin("");
              setSelectedLoginUserId(null);
              addLog(`Personnel session terminated. Returning to decentralized login portal.`);
              triggerNotificationToast("🔒 Securely logged out.");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600/10 text-red-200 rounded-xl hover:bg-red-600 hover:text-white border border-red-500/20 font-sans font-bold transition-all duration-200 cursor-pointer"
            title="Terminate secure session"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>

        </div>
      </section>

      {/* --- SIMULATED ROLE CONTEXT NOTIFIER --- */}
      <div className="bg-[#2D4F1E]/5 border-y border-[#2D4F1E]/10 py-3 px-4 text-center">
        <p className="text-xs text-[#1A2A1A] max-w-4xl mx-auto flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#2D4F1E] shrink-0" />
          <span>
            You are viewing the dashboard as <strong className="text-white bg-[#2D4F1E] px-2.5 py-0.5 rounded-full font-sans font-semibold text-[11px] uppercase tracking-wide">{activeUser.name}</strong> ({activeUser.role} role).
            Use the top console bar to switch anytime to test the farmer's leaf AI pathology, place escrow deposits as a Buyer, or certify crop grades as an Agri-Officer.
          </span>
        </p>
      </div>

      {/* --- MAIN PAGE CONTENT WORKSPACE --- */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* ========================================================
            🌾 VIEW: FARMER DASHBOARD
            ======================================================== */}
        {activeUser.role === "FARMER" && (
          <div id="farmer-workspace" className="space-y-8 animate-fadeIn font-sans">
            
            {/* -- Farmer Portfolio Profile Header -- */}
            <div className="bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D4F1E]/5 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl -z-10" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#2D4F1E]/10 text-[#2D4F1E] font-sans text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-[#2D4F1E]/20">
                      Farmer Profile Console
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#F97316]" /> {activeUser.upazila_district}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1A2A1A] flex items-center gap-2">
                    {activeUser.name}
                  </h2>
                  
                  <p className="text-sm text-gray-500 max-w-xl leading-relaxed font-medium">
                    Welcome to your agricultural portal. From here, list crop capacities directly to bulk corporate buyers, bypass middleman fees, and utilize live Gemini diagnostics to detect crop blights.
                  </p>
                </div>

                {/* Farmer Level & Trust Metrics */}
                {getFarmerProfile(activeUser.user_id) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:w-3/5 bg-[#F4F1EA]/60 rounded-2xl p-5 border border-[#1A2A1A]/5 text-[#1A2A1A]">
                    
                    {/* Level Card */}
                    <div className="space-y-1.5 p-1">
                      <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 font-medium">
                        <Award className="w-4 h-4 text-[#F97316]" /> Farmer Level
                      </div>
                      <div className="text-sm font-extrabold text-[#1A2A1A]">
                        {getFarmerProfile(activeUser.user_id)?.current_level}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {getFarmerProfile(activeUser.user_id)?.farm_size_acres} Acres Cultivated
                      </div>
                      <div className="w-full bg-[#1A2A1A]/10 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-[#2D4F1E] h-full rounded-full" 
                          style={{ 
                            width: getFarmerProfile(activeUser.user_id)?.current_level === "Seedling Farmer" ? "33%" : 
                                   getFarmerProfile(activeUser.user_id)?.current_level === "Harvest Master" ? "66%" : "100%" 
                          }}
                        />
                      </div>
                    </div>

                    {/* Global Trust Score Card */}
                    <div className="space-y-1.5 p-1 border-l border-[#1A2A1A]/10 pl-3 sm:pl-4">
                      <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 font-medium">
                        <Sparkles className="w-4 h-4 text-[#2D4F1E]" /> Trust Score
                      </div>
                      <div className="text-2xl font-extrabold text-[#2D4F1E] font-sans flex items-baseline gap-1">
                        {getFarmerProfile(activeUser.user_id)?.global_trust_score} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Verified High Grade
                      </div>
                    </div>

                    {/* Quality Ratings */}
                    <div className="col-span-2 sm:col-span-1 space-y-1.5 p-1 border-t sm:border-t-0 sm:border-l border-[#1A2A1A]/10 pt-3 sm:pt-0 pl-0 sm:pl-4">
                      <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Eco & Delivery
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-slate-500">Eco-Score:</span>
                          <span className="text-emerald-700 font-bold">{getFarmerProfile(activeUser.user_id)?.eco_score}%</span>
                        </div>
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-slate-500">On-Time:</span>
                          <span className="text-[#2D4F1E] font-bold">{getFarmerProfile(activeUser.user_id)?.on_time_delivery_rate}%</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

            {/* -- BENTO GRID: DIAGNOSTIC CELL & CROP INVENTORY FORM -- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* CELL 1: CROP LEAF PATHOLOGY LAB (7 cols) */}
              <div id="ai-clinic-section" className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 space-y-6 shadow-sm text-[#1A2A1A]">
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#1A2A1A] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#2D4F1E]" />
                      Gemini Pathology Diagnostic Clinic
                    </h3>
                    <p className="text-xs text-gray-500">Scan leaves instantly to diagnose fungal disease, nutrient rot, or pest outbreaks</p>
                  </div>
                  <span className="bg-[#2D4F1E]/10 text-[#2D4F1E] border border-[#2D4F1E]/20 px-2.5 py-1 text-[10px] rounded-full font-sans font-bold">
                    Powered by Gemini 3.5
                  </span>
                </div>

                {/* Specimen Choice */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A2A1A]/75 flex items-center gap-1.5 font-sans">
                    <Sliders className="w-3.5 h-3.5 text-[#2D4F1E]" /> Select Distressed Leaf Specimen
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cropSamples.map(sample => (
                      <button
                        key={sample.id}
                        id={`crop-specimen-${sample.id}`}
                        onClick={() => { setSelectedSample(sample); setCustomFile(null); }}
                        className={`text-left p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                          selectedSample?.id === sample.id
                            ? "bg-[#2D4F1E]/5 border-[#2D4F1E] shadow-sm"
                            : "bg-[#F4F1EA]/30 border-[#1A2A1A]/5 hover:border-[#1A2A1A]/20"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Colored visual placeholder leaf */}
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${sample.illustrationClass} flex items-center justify-center font-bold text-lg font-mono border border-slate-200 shrink-0`}>
                            🍃
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1A2A1A] tracking-tight">{sample.cropName} Crop Case</p>
                            <p className="text-[10px] text-gray-500 line-clamp-1">{sample.name}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Or Custom Upload */}
                  <div className="bg-[#F4F1EA]/40 border-2 border-dashed border-[#1A2A1A]/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#1A2A1A]/90">Or Upload Your Distressed Leaf</p>
                      <p className="text-[10px] text-gray-400 font-medium">Supports JPG, PNG from field camera</p>
                      {customFile && (
                        <p className="text-[11px] text-[#2D4F1E] font-mono mt-1">✓ Attached: {customFile.name}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        id="leaf-file-upload" 
                      />
                      <label 
                        htmlFor="leaf-file-upload" 
                        className="flex items-center gap-1.5 px-3 py-2 bg-white text-xs text-[#1A2A1A] rounded-xl hover:bg-gray-50 border border-gray-300 transition-all font-sans font-semibold shadow-sm cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#2D4F1E]" /> Browse file
                      </label>

                      {customFile && (
                        <input
                          type="text"
                          value={customCropName}
                          onChange={(e) => setCustomCropName(e.target.value)}
                          placeholder="Crop name"
                          className="px-3 py-2 bg-white border border-gray-300 text-xs text-[#1A2A1A] rounded-xl font-medium w-28 placeholder-gray-400 focus:outline-[#2D4F1E]"
                          title="Type the name of the crop uploaded"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Scan Action Button */}
                <button
                  id="run-diagnostic-scan-btn"
                  onClick={handleDiagnoseCrop}
                  disabled={isScanning}
                  className={`w-full py-4 rounded-2xl font-bold font-sans tracking-wide text-xs uppercase flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    isScanning 
                      ? "bg-slate-200 text-slate-400" 
                      : "bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold active:translate-y-0.5 transition-all"
                  }`}
                >
                  {isScanning ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin text-white" />
                      <span>{scanProgress}</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4.5 h-4.5" />
                      <span>Run Agricultural Diagnostic Scan</span>
                    </>
                  )}
                </button>

                {/* Report Outputs */}
                {activeReport && (
                  <div id="diagnostic-report-output" className="space-y-4 bg-[#2D4F1E] text-white rounded-3xl p-6 shadow-md border-0 relative overflow-hidden font-sans animate-fadeIn">
                    
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div className="space-y-1">
                        <div className="text-[10px] text-[#F97316] font-bold uppercase tracking-wider font-mono">
                          PATHOLOGY SCAN REPORT
                        </div>
                        <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                          {activeReport.issueName}
                        </h4>
                        <p className="text-xs text-teal-300 italic">Scientific: {activeReport.pathogen}</p>
                      </div>

                      <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/10 text-center">
                        <p className="text-[9px] text-white/70 font-bold uppercase font-sans">AI Confidence</p>
                        <p className="text-xl font-black text-emerald-400 font-sans">{activeReport.confidence}%</p>
                      </div>
                    </div>

                    <p className="text-xs text-white/90 leading-relaxed bg-black/10 p-3 rounded-xl border border-white/5">
                      {activeReport.summary}
                    </p>

                    {/* N-P-K Soil Matrix Advice */}
                    <div className="space-y-3 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1 font-sans">
                        <Sliders className="w-3.5 h-3.5 text-orange-400" /> Soil Nutrition & Water Prescriptions
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-orange-400 font-bold font-sans">Nitrogen (N):</span>
                          <p className="text-[11px] text-white/85 mt-1">{activeReport.soilRecommendations.nitrogen}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-teal-300 font-bold font-sans">Phosphorus (P):</span>
                          <p className="text-[11px] text-white/85 mt-1">{activeReport.soilRecommendations.phosphorus}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-amber-300 font-bold font-sans">Potassium (K):</span>
                          <p className="text-[11px] text-white/85 mt-1">{activeReport.soilRecommendations.potassium}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-sky-300 font-bold font-sans">Moisture Management:</span>
                          <p className="text-[11px] text-white/85 mt-1">{activeReport.soilRecommendations.moisture}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Checklist */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F97316]" /> Essential Urgency Countermeasures
                      </span>
                      <ul className="space-y-2">
                        {activeReport.actionItems.map((item: string, i: number) => (
                           <li key={i} className="flex items-start gap-2.5 text-xs text-white/90">
                            <span className="w-5 h-5 rounded-full bg-white/10 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 border border-white/10">
                              {i + 1}
                            </span>
                            <span className="mt-0.5">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rating stamp recommendation & Emergency Filing */}
                    <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl">
                      <div className="text-xs">
                        <p className="text-white/70">Post-Remediation Suggested Grade:</p>
                        <span className="inline-flex items-center gap-1 text-md font-extrabold text-white mt-0.5">
                          Grade '{activeReport.productionGrade}' Standard
                        </span>
                      </div>

                      {/* File Support ticket with diagnostic attached */}
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          placeholder="Add urgency memo to SAAO..."
                          className="px-3.5 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/55 rounded-xl text-xs focus:outline-none focus:border-[#F97316] placeholder-slate-200"
                        />
                        <button
                          id="submit-helpline-ticket-btn"
                          onClick={handleSubmitTicket}
                          className="px-4 py-2.5 bg-[#F97316] text-white rounded-xl hover:bg-[#F97316]/95 text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" /> Filed Helpline SAAO Alert Case
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {hasScanned && !activeReport && !isScanning && (
                  <div className="bg-red-50 text-red-700 border border-red-150 p-4 rounded-xl text-center text-xs">
                    Could not generate leaf pathology diagnostic. Please verify the photo properties or select a pre-configured leaf mock sample.
                  </div>
                )}

              </div>

              {/* CELL 2: LIST YIELD FOR DIRECT BULK TRADE (5 cols) */}
              <div id="add-listing-section" className="lg:col-span-5 bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 space-y-6 shadow-sm text-[#1A2A1A]">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1A2A1A] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#2D4F1E]" />
                    Marketplace Listings Center
                  </h3>
                  <p className="text-xs text-gray-500">Post your expected harvest crop batches directly to escape middleman extortion and lock upfront pricing</p>
                </div>

                <form onSubmit={handleListCrop} className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1A2A1A]/80 font-sans">Crop Name / Variety</label>
                    <input
                      type="text"
                      id="input-listing-crop-name"
                      placeholder="e.g., High-Yield Aman Rice (BR-11)"
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F4F1EA]/50 border-2 border-[#1A2A1A]/5 focus:border-[#2D4F1E] rounded-xl text-xs text-[#1A2A1A] placeholder-gray-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1A2A1A]/80 font-sans">Total Volume (KG)</label>
                      <input
                        type="number"
                        id="input-listing-quantity"
                        placeholder="e.g., 2500"
                        value={newCropQuantity}
                        onChange={(e) => setNewCropQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-4 py-3 bg-[#F4F1EA]/50 border-2 border-[#1A2A1A]/5 focus:border-[#2D4F1E] rounded-xl text-xs text-[#1A2A1A] font-medium placeholder-gray-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1A2A1A]/80 font-sans">Base Price (Per KG BDT)</label>
                      <input
                        type="number"
                        id="input-listing-price"
                        placeholder="e.g., 28.50"
                        value={newCropPrice}
                        onChange={(e) => setNewCropPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-4 py-3 bg-[#F4F1EA]/50 border-2 border-[#1A2A1A]/5 focus:border-[#2D4F1E] rounded-xl text-xs text-[#1A2A1A] font-medium placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1A2A1A]/80 font-sans">Estimated Harvest Date</label>
                    <input
                      type="date"
                      id="input-listing-harvest-date"
                      value={newCropHarvestDate}
                      onChange={(e) => setNewCropHarvestDate(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F4F1EA]/50 border-2 border-[#1A2A1A]/5 focus:border-[#2D4F1E] rounded-xl text-xs text-[#1A2A1A] font-medium focus:outline-none"
                    />
                  </div>

                  {listError && (
                    <div className="text-xs text-red-600 font-sans font-bold bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-500" /> {listError}
                    </div>
                  )}

                  {listSuccess && (
                    <div className="text-xs text-[#2D4F1E] font-sans font-bold bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2D4F1E]" /> Listing created successfully! Visible on B2B marketplace dashboard.
                    </div>
                  )}

                  <button
                    type="submit"
                    id="submit-crop-listing-btn"
                    className="w-full py-4 bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Post Capacity listing to B2B Board
                  </button>
                </form>

                {/* Direct Shipping Assistance notification */}
                <div className="bg-[#F97316]/5 border-2 border-[#F97316]/10 rounded-2xl p-4 flex gap-3 leading-relaxed text-xs">
                  <Truck className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" />
                  <div className="space-y-1 text-slate-700 font-medium">
                    <p className="font-bold text-[#1A2A1A]">Automated Geographic Logistics Pooling</p>
                    <p>
                      Your listing in <strong className="text-[#2D4F1E]">{activeUser.upazila_district}</strong> is auto-grouped with nearby smallholder harvest bundles! This drops container corporate bulk hauling costs by avg 35%.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* -- MY ACTIVE HARVEST YIELD LISTINGS -- */}
            <div className="bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 space-y-4 shadow-sm text-[#1A2A1A]">
              <h3 className="text-md font-bold text-[#1A2A1A] uppercase tracking-wide font-sans flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#2D4F1E]" />
                Active Registered Yield Offers
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-[10px] uppercase font-sans">
                      <th className="pb-3 text-left">Yield Code</th>
                      <th className="pb-3 text-left">Crop / Variety</th>
                      <th className="pb-3 text-right">Volume (KG)</th>
                      <th className="pb-3 text-right">Target (BDT/KG)</th>
                      <th className="pb-3 text-left">Estimated Harvest</th>
                      <th className="pb-3 text-left">Verification Badge</th>
                      <th className="pb-3 text-left">Listing Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropBatches.filter(b => b.farmer_id === activeUser.user_id).map(batch => (
                      <tr key={batch.batch_id} className="border-b border-[#1A2A1A]/5 hover:bg-[#F4F1EA]/30 transition-colors">
                        <td className="py-4 font-mono font-bold text-gray-400">#{batch.batch_id}</td>
                        <td className="py-4 font-bold text-[#1A2A1A]">{batch.crop_name}</td>
                        <td className="py-4 text-right font-semibold text-[#1A2A1A]">{batch.quantity_kg.toLocaleString()} kg</td>
                        <td className="py-4 text-right font-medium text-gray-500">{batch.base_price_per_kg.toFixed(2)} BDT</td>
                        <td className="py-4 font-medium text-gray-400">{batch.estimated_harvest_date}</td>
                        <td className="py-4">
                          {batch.officer_verified ? (
                            <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-sky-100 uppercase font-sans">
                              <BadgeCheck className="w-3.5 h-3.5 text-sky-600" /> SAAO Grade {batch.production_grade}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-amber-200 uppercase font-sans">
                              Self-Declared ID
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-sans ${
                            batch.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            batch.status === "RESERVED" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-gray-100 text-gray-400"
                          }`}>
                            {batch.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* -- MY INCOMING B2B ESCROW TRANSACTIONS -- */}
            <div className="bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 space-y-4 shadow-sm text-[#1A2A1A]">
              <h3 className="text-md font-bold text-[#1A2A1A] uppercase tracking-wide font-sans flex items-center gap-2">
                <DollarSign className="w-4.5 h-4.5 text-[#2D4F1E]" />
                Active B2B Escrow Locked Escrows
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {escrowContracts.filter(c => c.farmer_id === activeUser.user_id).map(contract => (
                  <div key={contract.bid_id} className="bg-[#F4F1EA]/30 border-2 border-[#1A2A1A]/5 rounded-2xl p-5 space-y-3">
                    
                    <div className="flex justify-between items-start border-b border-gray-200 pb-2.5">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Escrow Ref: #{contract.bid_id}</p>
                        <p className="text-sm font-bold text-[#1A2A1A] mt-0.5">{contract.crop_name}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        contract.status === "SECURED_IN_ESCROW" ? "bg-sky-50 text-sky-700 border border-sky-200" :
                        contract.status === "RELEASED_TO_FARMER" ? "bg-emerald-50 text-emerald-700 border border-emerald-150" :
                        "bg-red-50 text-red-500 border border-red-150"
                      }`}>
                        {contract.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs leading-relaxed font-sans">
                      <div>
                        <span className="text-gray-400 font-bold">Corporate Buyer:</span>
                        <p className="text-[#1A2A1A] font-extrabold">{contract.buyer_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold">Secured Account:</span>
                        <p className="text-[#2D4F1E] font-extrabold">{contract.amount_total.toLocaleString()} BDT</p>
                      </div>
                    </div>

                    {contract.status === "SECURED_IN_ESCROW" && !contract.delivery_date && (
                      <div className="pt-2 flex justify-end">
                        <button
                          id={`farmer-deliver-btn-${contract.bid_id}`}
                          onClick={() => handleFarmerDeliver(contract.bid_id)}
                          className="px-3.5 py-2 bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Clear & Dispatch Produce Delivery
                        </button>
                      </div>
                    )}

                    {contract.delivery_date && contract.status === "SECURED_IN_ESCROW" && (
                      <p className="text-[10px] text-emerald-800 font-semibold italic bg-emerald-50 p-2 text-center rounded-xl border border-emerald-200">
                        ✓ Harvest dispatched on {contract.delivery_date}. Awaiting superstore arrival quality signoff to release funds.
                      </p>
                    )}
                  </div>
                ))}

                {escrowContracts.filter(c => c.farmer_id === activeUser.user_id).length === 0 && (
                  <p className="col-span-2 text-center py-6 text-xs text-slate-500 font-sans font-medium">No active locked escrows found. Pre-negotiate with Agora Buyer on the top simulation selector to secure a deposit!</p>
                )}
              </div>
            </div>

            {/* -- MY HELPLINE SUPPORT HISTORIES -- */}
            <div className="bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 space-y-4 shadow-sm text-[#1A2A1A]">
              <h3 className="text-md font-bold text-[#1A2A1A] uppercase tracking-wide font-sans flex items-center gap-2">
                <HelpCircle className="w-4.5 h-4.5 text-[#2D4F1E]" />
                Farmer Sub-District Helpline SAAO Inbox
              </h3>

              <div className="space-y-4">
                {agriTickets.filter(t => t.farmer_id === activeUser.user_id).map(ticket => (
                  <div key={ticket.ticket_id} className="bg-[#F4F1EA]/30 border-2 border-[#1A2A1A]/5 rounded-2xl p-5 space-y-3.5">
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                      <div className="flex items-center gap-2 font-sans">
                        <span className="text-xs text-gray-400 font-bold">Case Ticket #{ticket.ticket_id}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[#1A2A1A] text-xs font-extrabold">{ticket.crop_name} Disease alert</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-sans ${
                        ticket.solved ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {ticket.solved ? "Resolved / Certified" : "Awaiting Field Visit"}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 leading-relaxed text-[#1A2A1A] font-sans">
                      <p className="text-gray-500"><strong className="text-[#1A2A1A] font-medium">Farmer distress description:</strong> {ticket.description}</p>
                      {ticket.ai_diagnosed_disease && (
                        <p className="text-[11px] text-[#2D4F1E] bg-[#2D4F1E]/5 p-2 px-3 rounded-lg mt-2 inline-block font-sans font-extrabold">
                          ✦ Gemini Smart Scanner diagnostic: <strong className="font-sans font-extrabold text-[#2D4F1E] underline">{ticket.ai_diagnosed_disease}</strong>
                        </p>
                      )}
                    </div>

                    {ticket.solved && ticket.response_text ? (
                      <div className="bg-emerald-50/50 border-l-4 border-[#2D4F1E] p-3.5 rounded-r-xl text-xs space-y-1.5 leading-relaxed text-[#1A2A1A]">
                        <p className="font-bold text-[#2D4F1E] font-sans">✓ Upazila SAAO Agricultural Officer Advisory Command:</p>
                        <p className="text-slate-700 italic font-semibold">"{ticket.response_text}"</p>
                        {ticket.solved_at && (
                          <p className="text-[10px] text-slate-400 font-medium">Resolved Date: {new Date(ticket.solved_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-450 italic bg-[#F4F1EA]/60 p-2 text-center rounded-xl font-medium">
                        ⏳ Local Upazila Officer notified of your location footprint. They will comment and stamp custom certification badges shortly.
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* -- NEW: FARMER-DOCTOR CLINIC APPOINTMENTS PANEL -- */}
            <div className="bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 space-y-6 shadow-sm text-[#1A2A1A]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1A2A1A] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#2D4F1E]" />
                    Agri-Doctor Pathology Consultation Desk
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">Book professional diagnosis appointments with certified pathology experts and track active prescriptions.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1.5 rounded-xl text-[11px] font-sans font-bold flex items-center gap-1.5 shadow-sm self-start">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Specialists Online & Ready
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Appointment Scheduler (5 cols) */}
                <div className="lg:col-span-5 bg-[#F4F1EA]/30 p-5 rounded-2xl border border-[#1A2A1A]/5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 font-sans">Book Live Specialist Consultation</h4>
                  
                  <form onSubmit={handleBookDoctorAppointment} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 font-sans block">Select Crop Pathology Doctor</label>
                      <select
                        value={bookDoctorId}
                        onChange={(e) => setBookDoctorId(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] font-bold outline-none cursor-pointer focus:border-[#2D4F1E]"
                      >
                        {users.filter(u => u.role === "DOCTOR").map(d => (
                          <option key={d.user_id} value={d.user_id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 font-sans block">Target Crop Variety</label>
                      <input
                        type="text"
                        value={bookCropName}
                        onChange={(e) => setBookCropName(e.target.value)}
                        placeholder="e.g., Cardinal Red Potatoes, Tossa Jute"
                        className="w-full px-3 py-2 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] font-medium outline-none focus:border-[#2D4F1E]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 font-sans block">Preferred Date</label>
                        <input
                          type="date"
                          value={bookDate}
                          onChange={(e) => setBookDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] font-medium outline-none focus:border-[#2D4F1E]"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 font-sans block">Preferred Time Window</label>
                        <select
                          value={bookTime}
                          onChange={(e) => setBookTime(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] font-medium outline-none focus:border-[#2D4F1E]"
                        >
                          <option value="09:00 AM">09:00 AM (Morning Audit)</option>
                          <option value="11:00 AM">11:00 AM (Midday Inspect)</option>
                          <option value="02:30 PM">02:30 PM (Afternoon Audit)</option>
                          <option value="04:00 PM">04:00 PM (Sunset Consult)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 font-sans block">Describe Crop Symptoms & Problems</label>
                        {activeReport && (
                          <button
                            type="button"
                            onClick={() => setBookProblemDesc(`Linked AI Scan Report: Crop has suspected '${activeReport.suspectedDisease}'. Severity: ${activeReport.severityScore}. Suggestions: ${activeReport.treatmentSteps}`)}
                            className="text-[9.5px] text-[#2D4F1E] font-extrabold uppercase hover:underline flex items-center gap-0.5 cursor-pointer font-sans"
                          >
                            <Sparkles className="w-3 h-3 text-[#F97316] animate-pulse" /> Link Active AI Report
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={bookProblemDesc}
                        onChange={(e) => setBookProblemDesc(e.target.value)}
                        placeholder="Detail yellowing leaves, spotted roots, insect activity, or sudden soil collapse..."
                        className="w-full px-3.5 py-2 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] font-medium outline-none focus:border-[#2D4F1E]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      File Consultation Booking Request
                    </button>
                  </form>
                </div>

                {/* Consultations List (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 font-sans">Active Consultation History</h4>
                  
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {doctorAppointments.filter(a => a.farmer_id === activeUser.user_id).map(appt => (
                      <div key={appt.appointment_id} className="bg-[#F4F1EA]/30 border border-[#1A2A1A]/10 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-gray-400 font-bold uppercase font-mono">Case ID: #{appt.appointment_id}</span>
                            <h5 className="text-xs font-extrabold text-[#1A2A1A]">{appt.crop_name}</h5>
                          </div>
                          
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider ${
                            appt.status === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            appt.status === "ACCEPTED" ? "bg-sky-50 text-sky-700 border border-sky-200 animate-pulse" :
                            appt.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {appt.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 font-medium font-sans">
                          <p><span className="text-gray-400 font-bold font-sans">Specialist Assigned:</span> {appt.doctor_name}</p>
                          <p className="mt-1 bg-white p-2.5 rounded-xl border border-gray-100 text-slate-600 font-semibold leading-relaxed">
                            <strong>Problem notes:</strong> {appt.problem_description}
                          </p>
                        </div>

                        {appt.status === "COMPLETED" && appt.prescription_notes && (
                          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded-r-xl space-y-1">
                            <span className="text-[10px] text-emerald-800 font-extrabold uppercase font-sans tracking-wide flex items-center gap-1">
                              💊 Issued Specialist Prescription
                            </span>
                            <p className="text-xs text-slate-700 italic font-bold">"{appt.prescription_notes}"</p>
                          </div>
                        )}

                        {appt.status === "ACCEPTED" && (
                          <p className="text-[10px] text-sky-700 font-semibold italic bg-sky-50 p-2 text-center rounded-xl border border-sky-100">
                            ✓ Dr. {appt.doctor_name.split(" ").pop()} has accepted your appointment slot ({appt.appointment_date} at {appt.appointment_time}). Awaiting active advisory prescription commands.
                          </p>
                        )}

                        {appt.status === "PENDING" && (
                          <p className="text-[10px] text-amber-600 font-semibold italic bg-amber-50/50 p-2 text-center rounded-xl border border-amber-100 font-sans">
                            ⏳ Awaiting specialist response. You will receive an in-app push notification once confirmed.
                          </p>
                        )}
                      </div>
                    ))}

                    {doctorAppointments.filter(a => a.farmer_id === activeUser.user_id).length === 0 && (
                      <div className="bg-[#F4F1EA]/10 border border-dashed border-gray-200 rounded-2xl py-12 text-center text-xs text-gray-400 font-sans font-bold">
                        No scheduled medical pathology consultations filed. Book above to consult certified plant doctors!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            🏢 VIEW: B2B BUYER MARKETPLACE PORTAL
            ======================================================== */}
        {activeUser.role === "BUYER" && (
          <div id="buyer-workspace" className="space-y-8 animate-fadeIn">
            
            {/* Buyer Page Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-6 rounded-3xl border-2 border-[#1A2A1A]/5 space-y-2 relative overflow-hidden shadow-sm">
                <Briefcase className="absolute right-3.5 top-3.5 w-8 h-8 text-[#2D4F1E]/5" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Buyer Account</p>
                <h4 className="text-lg font-bold text-[#1A2A1A] line-clamp-1">{activeUser.name.split(" ")[0]}</h4>
                <p className="text-xs text-gray-500 font-medium">{activeUser.upazila_district}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-[#1A2A1A]/5 space-y-1.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Escrow Secured Volume</p>
                <h4 className="text-2xl font-black text-[#2D4F1E] font-sans">
                  {escrowContracts.reduce((sum, c) => c.status === "SECURED_IN_ESCROW" ? sum + c.amount_total : sum, 0).toLocaleString()} <span className="text-xs text-gray-400 font-semibold">BDT</span>
                </h4>
                <p className="text-[10px] text-gray-550 font-medium">Locked in secure contract accounts</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-[#1A2A1A]/5 space-y-1.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Active B2B Contracts</p>
                <h4 className="text-2xl font-black text-[#1A2A1A] font-sans">
                  {escrowContracts.filter(c => c.status === "SECURED_IN_ESCROW").length} Active
                </h4>
                <p className="text-[10px] text-gray-500 font-medium">Awaiting cargo receipt check</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-[#1A2A1A]/5 space-y-1.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Carbon Miles Avoided</p>
                <h4 className="text-2xl font-black text-emerald-700 font-sans">420 Tons</h4>
                <p className="text-[10px] text-gray-500 font-medium">Via geographical transport pooling</p>
              </div>

            </div>

            {/* Direct Fair-Price Marketplace Header */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-[#1A2A1A]/5 space-y-5 shadow-sm text-[#1A2A1A]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1A2A1A] flex items-center gap-2 font-sans">
                    🌾 Direct Farmer B2B Open Produce Marketplace
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Filter, check verified high-integrity profiles, and secure listings using escrow smart contracts.</p>
                </div>

                {/* Score Formula Visualizer */}
                <div className="bg-[#F4F1EA]/50 border border-[#1A2A1A]/5 rounded-2xl p-4.5 max-w-sm text-[10px] leading-relaxed text-[#1A2A1A] font-sans shadow-inner">
                  <p className="font-bold text-[#1A2A1A] uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#2D4F1E]" /> High-Trust Scoring Formula
                  </p>
                  <p className="mt-1.5 text-gray-600 font-medium">
                    Farmer Rank Score = <code className="text-[#2D4F1E] font-mono font-bold">(0.4 * Reviews) + (0.3 * SAAO Certifications) + (0.2 * OnTime Delivery) + (0.1 * Eco)</code>
                  </p>
                </div>
              </div>

              {/* Advanced Marketplace Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#F4F1EA]/30 p-4 rounded-2xl border border-[#1A2A1A]/5">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 font-sans">Search Keyword</label>
                  <input
                    type="text"
                    id="buyer-search-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search crop, region, name..."
                    className="w-full px-3 py-1.5 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 font-sans font-medium">Crop Variety</label>
                  <select
                    id="buyer-filter-crop"
                    value={cropFilter}
                    onChange={(e) => setCropFilter(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] focus:outline-none"
                  >
                    <option value="ALL">All Crops Varieties (Rice, Onion, etc)</option>
                    <option value="Rice">Boro Aman Rice</option>
                    <option value="Potato">Cardinal Potato</option>
                    <option value="Jute">Tossa Jute Fiber</option>
                    <option value="Mango">Amrapali Mango</option>
                    <option value="Pepper">Hydroponic Bell Peppers</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 font-sans">Upazila sub-district</label>
                  <select
                    id="buyer-filter-district"
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] focus:outline-none"
                  >
                    <option value="ALL">All Regional Districts</option>
                    <option value="Gazipur">Kaliakair, Gazipur</option>
                    <option value="Bogura">Shibganj, Bogura</option>
                    <option value="Moulvibazar">Sreemangal, Moulvibazar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 font-sans">Quality Standards</label>
                  <select
                    id="buyer-filter-verification"
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] focus:outline-none"
                  >
                    <option value="ALL">All Listings</option>
                    <option value="VERIFIED">SAAO Office Certified</option>
                    <option value="UNVERIFIED">Farmer Self-Declared</option>
                  </select>
                </div>

              </div>

              {/* Grid of Active Listings */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
                {filteredCrops.map(batch => {
                  const profile = getFarmerProfile(batch.farmer_id);
                  const isReserved = batch.status === "RESERVED";
                  
                  return (
                    <div 
                      key={batch.batch_id} 
                      className={`bg-white rounded-3xl border p-5.5 space-y-4 transition-all duration-350 flex flex-col justify-between shadow-sm ${
                        isReserved 
                          ? "border-gray-100 opacity-65 bg-gray-50/50" 
                          : "border-[#1A2A1A]/10 hover:border-[#2D4F1E]/30 hover:shadow-md"
                      }`}
                    >
                      
                      <div className="space-y-3">
                        {/* Upper row */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-sans font-bold uppercase">YIELD CODE: #{batch.batch_id}</span>
                          
                          {batch.officer_verified ? (
                            <span className="bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full text-[9px] font-bold font-sans tracking-wide uppercase">
                              ★ GRADE '{batch.production_grade}' SAAO Certified
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 border border-gray-200/50 px-2 py-0.5 rounded-full text-[9px] font-semibold font-sans uppercase">
                              Self-Declared ID
                            </span>
                          )}
                        </div>

                        {/* Title and location */}
                        <div className="space-y-1">
                          <h4 className="text-md font-bold text-[#1A2A1A]">{batch.crop_name}</h4>
                          <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#2D4F1E]" /> {batch.upazila_district}
                          </p>
                        </div>

                        {/* Farmer profile stats block */}
                        {profile && (
                          <div className="bg-[#F4F1EA]/50 p-3 rounded-2xl border border-[#1A2A1A]/5 space-y-1.5 font-sans">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[#1A2A1A] font-extrabold">{batch.farmer_name}</span>
                              <span className="text-[#2D4F1E] font-bold text-[10px] uppercase">{profile.current_level}</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-500 text-center">
                              <div className="border-r border-gray-200 pb-0.5 font-sans">
                                <p className="font-bold">Trust Score</p>
                                <strong className="text-[#1A2A1A] font-extrabold">{profile.global_trust_score}</strong>
                              </div>
                              <div className="border-r border-gray-200 pb-0.5 font-sans">
                                <p className="font-bold">Eco Score</p>
                                <strong className="text-[#2D4F1E] font-extrabold">{profile.eco_score}%</strong>
                              </div>
                              <div className="pb-0.5 font-sans">
                                <p className="font-bold">On-Time</p>
                                <strong className="text-emerald-700 font-extrabold">{profile.on_time_delivery_rate}%</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Inventory specs */}
                        <div className="grid grid-cols-2 gap-2 text-xs py-1 leading-relaxed">
                          <div className="p-2 bg-[#F4F1EA]/35 rounded-xl border border-[#1A2A1A]/5">
                            <p className="text-[9.5px] text-gray-400 font-bold uppercase font-sans">VOLUME IN STOCK</p>
                            <p className="text-[#1A2A1A] font-extrabold font-sans mt-0.5">{batch.quantity_kg.toLocaleString()} kg</p>
                          </div>
                          <div className="p-2 bg-[#F4F1EA]/35 rounded-xl border border-[#1A2A1A]/5">
                            <p className="text-[9.5px] text-gray-400 font-bold uppercase font-sans">B2B RATE PER KG</p>
                            <p className="text-[#1A2A1A] font-extrabold font-sans mt-0.5">{batch.base_price_per_kg.toFixed(2)} BDT</p>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs pt-1 text-gray-500 font-medium font-sans">
                          <span>Est. Harvest Date:</span>
                          <span className="text-[#1A2A1A] font-bold">{batch.estimated_harvest_date}</span>
                        </div>
                      </div>

                      {/* Total calculations & transaction trigger */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2.5">
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase font-sans font-bold">Locked Total Price</p>
                          <span className="text-md font-extrabold text-[#2D4F1E] font-sans">
                            {(batch.quantity_kg * batch.base_price_per_kg).toLocaleString()} BDT
                          </span>
                        </div>

                        {isReserved ? (
                          <span className="bg-[#F4F1EA] text-[#2D4F1E] text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200">
                            RESERVED & ESCROWED
                          </span>
                        ) : (
                          <button
                            id={`buy-listing-btn-${batch.batch_id}`}
                            onClick={() => handleBuyerPlaceEscrow(batch)}
                            className="px-4 py-2 bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all"
                          >
                            Lock Escrow Rate
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}

                {filteredCrops.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-slate-400 space-y-2">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-xs">No active listings match the selected filters on the B2B boards.</p>
                  </div>
                )}
              </div>

            </div>

            {/* AUTOMATED GEOGRAPHIC LOGISTICS POOLING BOARD */}
            <div className="bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 space-y-6 shadow-sm text-[#1A2A1A]">
              
              <div className="space-y-1">
                <h3 className="text-md font-bold text-[#1A2A1A] uppercase tracking-wider font-sans flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#2D4F1E]" />
                  Algorithmic Geographic Transport Pooling Clusters
                </h3>
                <p className="text-xs text-gray-550 font-medium">
                  Neighboring Level-1/Level-2 marginal farming plots auto-bundled in geographical haul routes to reduce buyer shipping costs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {logisticsPools.map(pool => (
                  <div key={pool.pool_id} className="bg-[#F4F1EA]/30 border-2 border-[#1A2A1A]/5 rounded-2xl p-5 space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                          <MapPin className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-[10px] text-gray-400 font-sans uppercase font-bold tracking-wider">ROUTE CLUSTER #{pool.pool_id}</span>
                          <h4 className="text-xs font-bold text-[#1A2A1A]">{pool.upazila_district}</h4>
                        </div>
                      </div>

                      <div className="bg-[#2D4F1E]/5 text-[#2D4F1E] px-3 py-1.5 rounded-xl border border-[#2D4F1E]/15 text-center shadow-sm">
                        <span className="text-[9px] text-gray-500 block font-sans font-bold uppercase">Estimated Savings</span>
                        <span className="text-lg font-black italic">-{pool.savings_percentage}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">Crop Category:</span>
                        <strong className="text-[#1A2A1A] font-bold">{pool.crop_name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">Bundled Smallholders:</span>
                        <strong className="text-[#1A2A1A] font-bold">{pool.farmer_count} Regional Farms</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">Accumulated Freight Cargo:</span>
                        <strong className="text-[#2D4F1E] font-extrabold">{pool.total_quantity_kg.toLocaleString()} KG</strong>
                      </div>
                    </div>

                    {/* Fun visual haul tracking route mapping */}
                    <div className="bg-white p-3 rounded-xl border border-[#1A2A1A]/5 flex items-center justify-between text-[11px] font-sans font-bold select-none shadow-inner">
                      <span className="text-gray-400">Plot Hub</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#2D4F1E]/40" />
                      <span className="text-[#2D4F1E]">Joint Upazila Loading Link</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#2D4F1E]/40" />
                      <span className="text-[#F97316]">Corporate Ingestion Hub</span>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* BUYER CARGO ARRIVAL CHECK & FUNDS RELEASE */}
            <div className="bg-white rounded-3xl border-2 border-[#1A2A1A]/5 p-6 md:p-8 space-y-4 shadow-sm text-[#1A2A1A]">
              <h3 className="text-md font-bold text-[#1A2A1A] uppercase tracking-wide font-sans flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#2D4F1E]" />
                Active Direct Harvest cargo Receivables & Escrow Release
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {escrowContracts.filter(c => c.buyer_id === activeUser.user_id && c.status === "SECURED_IN_ESCROW").map(contract => (
                  <div key={contract.bid_id} className="bg-[#F4F1EA]/30 border-2 border-[#1A2A1A]/5 rounded-2xl p-5 space-y-4">
                    
                    <div className="flex justify-between items-start border-b border-gray-200 pb-2.5">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Contract Bid: #{contract.bid_id}</p>
                        <h4 className="text-sm font-bold text-[#1A2A1A] mt-0.5">{contract.crop_name}</h4>
                      </div>
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2.5 py-1 rounded-full font-sans font-bold uppercase tracking-wider">
                        FUNDS LOCKED
                      </span>
                    </div>

                    <div className="text-xs space-y-1 font-sans leading-relaxed text-[#1A2A1A]">
                      <p className="flex justify-between"><span className="text-gray-400 font-bold">Source Smallholder:</span> <strong className="text-[#1A2A1A] font-extrabold">{contract.farmer_name}</strong></p>
                      <p className="flex justify-between"><span className="text-gray-400 font-bold">Escrow Amount:</span> <strong className="text-[#2D4F1E] font-extrabold">{contract.amount_total.toLocaleString()} BDT</strong></p>
                      <p className="flex justify-between">
                        <span className="text-gray-400 font-bold">Shipment Status:</span> 
                        <strong className="text-gray-700">
                          {contract.delivery_date ? `Shipped (Dispatched on ${contract.delivery_date})` : "Awaiting Farmer Harvesting"}
                        </strong>
                      </p>
                    </div>

                    {/* Escrow Release controls */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        id={`buyer-reject-btn-${contract.bid_id}`}
                        onClick={() => handleBuyerReleaseFunds(contract.bid_id, false)}
                        className="py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl text-xs hover:text-red-900 transition-all cursor-pointer"
                      >
                        Flag dispute Audits
                      </button>

                      <button
                        id={`buyer-approve-btn-${contract.bid_id}`}
                        onClick={() => handleBuyerReleaseFunds(contract.bid_id, true)}
                        className="py-2.5 bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold text-xs rounded-xl hover:shadow-md transition-all cursor-pointer"
                      >
                        Pass Quality & Release
                      </button>
                    </div>

                  </div>
                ))}

                {escrowContracts.filter(c => c.buyer_id === activeUser.user_id && c.status === "SECURED_IN_ESCROW").length === 0 && (
                  <p className="col-span-2 text-center py-6 text-xs text-slate-500 font-sans font-semibold">No active cargo shipments currently on-road. Lock expected crops on the Marketplace Feed above to simulate transport routes!</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            🔬 VIEW: AGRI-OFFICER WORKSPACE
            ======================================================== */}
        {((activeUser.role === "DOCTOR") || (activeUser.role === "AGRI_OFFICER") || (activeUser.role === "AGENT") || (activeUser.role === "ADMIN")) && (
          <div id="officer-workspace" className="space-y-8 animate-fadeIn text-[#1A2A1A]">
            
            {/* ========================================================
                🔬 SUB-VIEW: DOCTOR / CLINICAL PATHOLOGIST WORKSPACE
                ======================================================== */}
            {((activeUser.role === "DOCTOR") || (activeUser.role === "AGRI_OFFICER")) && (
              <div className="space-y-8 animate-fadeIn">
                {/* Live Notifications Banner */}
                {doctorAppointments.filter(a => a.doctor_id === activeUser.user_id && a.status === "PENDING").length > 0 && (
                  <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-3xl flex items-center justify-between gap-4 shadow-sm animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500 rounded-2xl text-white">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1A2A1A] font-sans font-semibold">Incoming Pathology Consultations Pending!</h4>
                        <p className="text-xs text-amber-800 font-medium font-sans">You have {doctorAppointments.filter(a => a.doctor_id === activeUser.user_id && a.status === "PENDING").length} new farmer crop distress tickets assigned to your clinic.</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-500 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                      Action Required
                    </span>
                  </div>
                )}

                {/* Doctor Profile Info Rows */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-[#1A2A1A]/5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl -z-10" />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full">
                          DAE Licensed Plant Pathologist Specialist
                        </span>
                        <span className="text-[#1A2A1A]/30 text-xs">•</span>
                        <span className="text-gray-550 text-xs flex items-center gap-1 font-bold">
                          CLINIC-ID: DAE-DOC-#{activeUser.user_id}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold tracking-tight text-[#1A2A1A]">{activeUser.name}</h2>
                      <p className="text-xs text-gray-550 leading-relaxed max-w-xl font-medium">
                        Welcome back to your Specialist Consultation Desk. Farmers across the district have matched with your crop pathology expertise. Review their AI diagnostics, accept appointments, and prescribe tailored treatment regimes to certify their grade yields.
                      </p>
                    </div>

                    {/* Pathology Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:w-1/2 bg-[#F4F1EA]/30 border-2 border-[#1A2A1A]/5 rounded-2xl p-4">
                      <div className="p-1 space-y-1 text-center sm:text-left">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Solved</span>
                        <strong className="text-xl font-extrabold text-[#1A2A1A]">
                          {doctorAppointments.filter(a => a.doctor_id === activeUser.user_id && a.status === "COMPLETED").length + 24}
                        </strong>
                      </div>
                      <div className="p-1 space-y-1 text-center sm:text-left border-l border-gray-200">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Active Cases</span>
                        <strong className="text-xl font-extrabold text-[#2D4F1E]">
                          {doctorAppointments.filter(a => a.doctor_id === activeUser.user_id && (a.status === "PENDING" || a.status === "ACCEPTED")).length}
                        </strong>
                      </div>
                      <div className="p-1 space-y-1 text-center sm:text-left border-l border-gray-200">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Rating</span>
                        <strong className="text-xl font-extrabold text-amber-600">★ 4.90</strong>
                      </div>
                      <div className="p-1 space-y-1 text-center sm:text-left border-l border-gray-200">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Jela Sector</span>
                        <strong className="text-xs font-black text-[#1A2A1A] block truncate uppercase mt-1">{activeUser.upazila_district.split(",").pop()?.trim() || "National"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BENTO GRID: PENDING SUPPORT TICKETS & GOV LEADERBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* CELL 1: SAAO HELPLINE INLET (8 cols) / DOCTOR PATHOLOGY INLET */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border-2 border-[#1A2A1A]/5 space-y-6 shadow-sm">
                {activeUser.role === "DOCTOR" ? (
                  // DOCTOR VIEW
                  <>
                    <div className="space-y-1">
                      <h3 className="text-md font-bold text-[#1A2A1A] flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#2D4F1E]" />
                        Incoming Emergency Pathology Consultation Appointments
                      </h3>
                      <p className="text-xs text-gray-400 font-semibold">Cases submitted by farmers requesting diagnostic verification and treatment prescriptions</p>
                    </div>

                    <div className="space-y-4">
                      {doctorAppointments.filter(a => a.doctor_id === activeUser.user_id).map(appt => (
                        <div key={appt.appointment_id} className="bg-[#F4F1EA]/30 border-2 border-[#1A2A1A]/5 rounded-2xl p-5 space-y-4">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                            <div className="space-y-0.5 font-sans">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CASE ID: #{appt.appointment_id} • {appt.appointment_date} {appt.appointment_time}</span>
                              <h4 className="text-sm font-bold text-[#1A2A1A]">{appt.farmer_name} • {appt.crop_name}</h4>
                            </div>

                            <span className={`px-3 py-1 text-[9px] font-bold font-sans uppercase tracking-wider rounded-full border ${
                              appt.status === "PENDING" ? "bg-amber-100 text-amber-700 border-amber-200" :
                              appt.status === "ACCEPTED" ? "bg-sky-100 text-sky-700 border-sky-200" :
                              appt.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}>
                              {appt.status}
                            </span>
                          </div>

                          <div className="text-xs space-y-3 font-sans">
                            <div className="p-3 bg-white rounded-2xl text-gray-700 font-sans border border-[#1A2A1A]/5 leading-relaxed shadow-inner">
                              <strong className="text-[#1A2A1A]/70">Farmer's problem description:</strong> "{appt.problem_description}"
                            </div>
                          </div>

                          {/* Doctor Action buttons */}
                          {appt.status === "PENDING" && (
                            <div className="flex justify-end gap-2.5">
                              <button
                                onClick={() => handleDoctorAction(appt.appointment_id, "DECLINED")}
                                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleDoctorAction(appt.appointment_id, "ACCEPTED")}
                                className="px-4 py-2 bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-colors"
                              >
                                Accept Slot
                              </button>
                            </div>
                          )}

                          {appt.status === "ACCEPTED" && (
                            <div className="pt-2 border-t border-gray-200 space-y-4">
                              <div className="space-y-1.5 font-sans">
                                <label className="text-xs font-bold text-[#1A2A1A] block">Treatment Prescription & Disease Advisory</label>
                                <textarea
                                  rows={3}
                                  placeholder="Describe your specialist findings, recommended chemicals/fungicides/organic compounds, watering alterations, and recovery timeline..."
                                  value={docPrescriptionNotes}
                                  onChange={(e) => setDocPrescriptionNotes(e.target.value)}
                                  className="w-full px-3.5 py-2.5 bg-white border border-[#1A2A1A]/10 focus:border-[#2D4F1E] rounded-2xl text-xs text-[#1A2A1A] outline-none leading-relaxed shadow-sm font-sans font-medium"
                                />
                              </div>

                              <div className="flex justify-end gap-2.5">
                                <button
                                  onClick={() => handleDoctorAction(appt.appointment_id, "COMPLETED", docPrescriptionNotes)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-colors"
                                >
                                  Issue Prescription & Complete
                                </button>
                              </div>
                            </div>
                          )}

                          {appt.status === "COMPLETED" && appt.prescription_notes && (
                            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded-r-xl space-y-1">
                              <span className="text-[10px] text-emerald-800 font-extrabold uppercase font-sans tracking-wide flex items-center gap-1">
                                💊 Prescribed treatment regime:
                              </span>
                              <p className="text-xs text-slate-700 italic font-bold">"{appt.prescription_notes}"</p>
                            </div>
                          )}

                        </div>
                      ))}

                      {doctorAppointments.filter(a => a.doctor_id === activeUser.user_id).length === 0 && (
                        <div className="bg-gray-50 border border-gray-200/50 p-8 rounded-2xl text-center text-xs text-[#1A2A1A] space-y-2 font-sans font-bold">
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                          <p>You have no assigned pathology consultation appointments scheduled in your queue.</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // AGRICULTURAL OFFICER VIEW
                  <>
                    <div className="space-y-1">
                      <h3 className="text-md font-bold text-[#1A2A1A] flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#2D4F1E]" />
                        Incoming Emergency Crop Pathology Alerts Inbox
                      </h3>
                      <p className="text-xs text-gray-400 font-semibold">Cases generated by smallholders requesting field verification support credentials</p>
                    </div>

                    <div className="space-y-4">
                      {agriTickets.filter(t => t.assigned_officer_id === activeUser.user_id).map(ticket => (
                        <div key={ticket.ticket_id} className="bg-[#F4F1EA]/30 border-2 border-[#1A2A1A]/5 rounded-2xl p-5 space-y-4">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                            <div className="space-y-0.5 font-sans">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CASE DIRECTORY: #{ticket.ticket_id}</span>
                              <h4 className="text-sm font-bold text-[#1A2A1A]">{ticket.farmer_name} • {ticket.crop_name} Field</h4>
                            </div>

                            <span className={`px-3 py-1 text-[9px] font-bold font-sans uppercase tracking-wider rounded-full border ${
                              ticket.solved ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"
                            }`}>
                              {ticket.solved ? "SOLVED & CERTIFIED" : "AWAITING INSPECTION"}
                            </span>
                          </div>

                          <div className="text-xs space-y-3 font-sans">
                            <div className="p-3 bg-white rounded-2xl text-gray-700 font-sans border border-[#1A2A1A]/5 leading-relaxed shadow-inner">
                              <strong className="text-[#1A2A1A]/70">Farmer's crop issue memo:</strong> "{ticket.description}"
                            </div>

                            {ticket.ai_diagnosed_disease && (
                              <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
                                <Activity className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                                <div className="text-[11px] text-emerald-950 leading-relaxed font-sans">
                                  <p className="font-bold text-emerald-800">✦ Server-side Gemini AI Diagnostic Scanning assists:</p>
                                  <p className="mt-0.5 text-emerald-950 font-medium">
                                    Diagnosed <strong className="text-emerald-900 font-extrabold">{ticket.ai_diagnosed_disease}</strong>. Soil suggestion: {ticket.soil_npk_advice}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Resolver widget */}
                          {!ticket.solved ? (
                            selectedTicketId === ticket.ticket_id ? (
                              <div className="pt-2 border-t border-gray-200 space-y-4 animate-fadeIn">
                                
                                <div className="space-y-1.5 font-sans">
                                  <label className="text-xs font-bold text-[#1A2A1A] block">Advisory Prescription Commands (Foliage & fertilizer management)</label>
                                  <textarea
                                    id="officer-ref-advice-input"
                                    rows={3}
                                    placeholder="e.g. Prune spotted foliage. Discontinue excessive urea Nitrogen instantly. Water base ridges only, organic copper fungicide spray."
                                    value={officerResponseText}
                                    onChange={(e) => setOfficerResponseText(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-[#1A2A1A]/10 focus:border-[#2D4F1E] rounded-2xl text-xs text-[#1A2A1A] outline-none leading-relaxed shadow-sm font-sans font-medium"
                                  />
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                                  
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-bold">Assigned Certification Grade Standard:</span>
                                    <select
                                      id="officer-ref-grade-input"
                                      value={officerGradeInput}
                                      onChange={(e) => setOfficerGradeInput(e.target.value as "A" | "B" | "C")}
                                      className="px-3 py-1.5 bg-white border border-[#1A2A1A]/10 rounded-xl text-xs text-[#1A2A1A] font-bold outline-none cursor-pointer"
                                    >
                                      <option value="A">Grade A (Premium/Export)</option>
                                      <option value="B">Grade B (Standard Commercial)</option>
                                      <option value="C">Grade C (Local Fair Standard)</option>
                                    </select>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setSelectedTicketId(null)}
                                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      id={`officer-resolve-btn-submit-${ticket.ticket_id}`}
                                      onClick={() => handleOfficerResolveTicket(ticket)}
                                      className="px-4 py-2 bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-colors"
                                    >
                                      Issue Quality Stamp & Solve
                                    </button>
                                  </div>

                                </div>

                              </div>
                            ) : (
                              <div className="flex justify-end pt-1">
                                <button
                                  id={`officer-resolve-action-btn-${ticket.ticket_id}`}
                                  onClick={() => { setSelectedTicketId(ticket.ticket_id); setOfficerResponseText(""); }}
                                  className="px-4 py-2 bg-[#2D4F1E] hover:bg-[#2D4F1E]/95 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Sliders className="w-3.5 h-3.5" /> Prescribe diagnostics & Certify Quality
                                </button>
                              </div>
                            )
                          ) : ticket.response_text && (
                            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded-r-xl space-y-1">
                              <span className="text-[10px] text-emerald-800 font-extrabold uppercase font-sans tracking-wide flex items-center gap-1">
                                ✓ Expert Advisory Prescribed:
                              </span>
                              <p className="text-xs text-slate-700 italic font-semibold">"{ticket.response_text}"</p>
                            </div>
                          )}

                        </div>
                      ))}

                      {agriTickets.filter(t => t.assigned_officer_id === activeUser.user_id).length === 0 && (
                        <div className="bg-gray-50 border border-gray-200/50 p-8 rounded-2xl text-center text-xs text-[#1A2A1A] space-y-2 font-sans font-bold">
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                          <p>Perfect score! No pathology or verification cases currently assigned to you.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* CELL 2: UPAZILA PUBLIC OFFICER LEADERBOARD (4 cols) */}
              <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl border-2 border-[#1A2A1A]/5 space-y-6 shadow-sm">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1A2A1A] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#2D4F1E]" />
                    Upazila Public Leaderboard
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">SAAO officers ranked by local farmers based on speed, visitation rates and response accuracy</p>
                </div>

                <div className="space-y-3.5 font-sans">
                  {[
                    { rank: 1, name: "Ms. Nusrat Jahan Akhter", rating: 4.95, solved: 512, time: "25 min response", tag: "Pest Pathologist" },
                    { rank: 2, name: "Dr. Rafiqul Rahman", rating: 4.80, solved: 342, time: "42 min response", tag: "Soil Management" },
                    { rank: 3, name: "Tasnim Islam", rating: 4.65, solved: 198, time: "55 min response", tag: "Hydrologic Irrigation" },
                    { rank: 4, name: "A. S. M. Khorshed Alam", rating: 4.40, solved: 154, time: "78 min response", tag: "Seed Agronomy" }
                  ].map(officer => {
                    const isCurrentUser = officer.name === activeUser.name || officer.name.includes(activeUser.name.split(" ")[0]);
                    return (
                      <div 
                        key={officer.rank} 
                        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                          isCurrentUser
                            ? "bg-[#2D4F1E]/5 border-[#2D4F1E]/30 shadow-sm"
                            : "bg-[#F4F1EA]/30 border-[#1A2A1A]/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-sans font-extrabold text-xs ${
                            officer.rank === 1 ? "bg-amber-400 text-amber-950 shadow-sm" :
                            officer.rank === 2 ? "bg-gray-200 text-gray-700" :
                            officer.rank === 3 ? "bg-amber-100 text-amber-800" :
                            "bg-gray-100 text-gray-400"
                          }`}>
                            {officer.rank}
                          </span>

                          <div className="space-y-0.5">
                            <p className="text-xs font-extrabold text-[#1A2A1A]">
                              {officer.name} {isCurrentUser && "(You)"}
                            </p>
                            <span className="text-[9px] text-[#2D4F1E] uppercase font-sans font-black tracking-wider">{officer.tag}</span>
                          </div>
                        </div>

                        <div className="text-right space-y-0.5 font-sans">
                          <p className="text-xs font-extrabold text-amber-600">★ {officer.rating.toFixed(2)}</p>
                          <p className="text-[10px] text-gray-500 font-semibold">{officer.solved} cases</p>
                        </div>

                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-[#2D4F1E]/5 border border-[#2D4F1E]/10 rounded-2xl leading-relaxed text-[11px] text-gray-700 font-sans">
                  <p className="font-extrabold text-[#2D4F1E] uppercase tracking-wide">Competition Incentive Program</p>
                  <p className="mt-1 font-medium">
                    Public officers ranking within the regional Top 2 on the leaderboard secure priority resource grants and specialized international agronomy training seminars from BARC.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* --- FOOTER CARD --- */}
      <footer className="border-t border-gray-200 bg-white py-12 px-4 text-center text-xs text-gray-400 mt-20 font-sans">
        <div className="max-w-4xl mx-auto space-y-1 font-semibold">
          <p className="text-gray-500">© 2026 Smart Farmer Portal • BARC/BRAC Agronomy Verification Systems</p>
          <p className="text-[11px] text-gray-400">Eliminating transaction asymmetric friction • Powered by Gemini Flash 3.5 AI diagnostics</p>
        </div>
      </footer>

    </div>
  );
}
