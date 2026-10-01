export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'user' | 'admin';

export type UserStatus = 'active' | 'suspended';

export type DonorVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'expired';

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed' | 'expired';

export type HelpmeUrgency = 'critical' | 'urgent' | 'moderate';

export type HelpmeStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled';

export type CommunityCategory = 'story' | 'tip' | 'question' | 'advocacy';

export type EventType = 'blood_drive' | 'hospital_drive' | 'advocacy' | 'official_announcement';

export interface Region {
    id: number;
    code: string;
    name: string;
    region_name: string;
}

export interface Province {
    id: number;
    region_id: number;
    name: string;
    region?: Region;
}

export interface City {
    id: number;
    province_id: number;
    name: string;
    is_city: boolean;
    latitude: number | null;
    longitude: number | null;
    province?: Province;
}

export interface Barangay {
    id: number;
    city_id: number;
    name: string;
    latitude: number | null;
    longitude: number | null;
}

export interface UserSetting {
    id: number;
    user_id: number;
    theme: 'light' | 'dark' | 'system';
    show_phone: boolean;
    location_privacy: 'exact' | 'approximate' | 'barangay' | 'city' | 'hidden';
    show_donor_availability: boolean;
    profile_visibility: 'public' | 'users_only' | 'hidden';
    notify_requests: boolean;
    notify_helpme: boolean;
    notify_events: boolean;
    notify_community: boolean;
}

export interface DonorCard {
    id: number;
    user_id: number;
    blood_type: BloodType;
    is_available: boolean;
    verification_status: DonorVerificationStatus;
    rejection_reason?: string | null;
    verified_at?: string | null;
    verified_by?: number | null;
    donor_card_number?: string | null;
    search_radius_km: number;
    preferred_contact_method: 'app' | 'phone' | 'email' | 'both';
    emergency_ready: boolean;
    last_donation_date?: string | null;
    total_donations_count: number;
    notes?: string | null;
    id_document_path?: string | null;
    created_at?: string;
    updated_at?: string;
    user?: User;
}

export interface User {
    id: number;
    name: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    phone?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    blood_type?: BloodType | null;
    role: UserRole;
    status: UserStatus;
    avatar?: string | null;
    bio?: string | null;
    region_id?: number | null;
    province_id?: number | null;
    city_id?: number | null;
    barangay_id?: number | null;
    address?: string | null;
    location_string?: string;
    latitude?: number | null;
    longitude?: number | null;
    province?: Province | null;
    city?: City | null;
    barangay?: Barangay | null;
    donor_card?: DonorCard | null;
    settings?: UserSetting | null;
    is_admin?: boolean;
    unread_notifications_count?: number;
    created_at?: string;
}

export interface RequestStatusHistory {
    id: number;
    assistance_request_id: number;
    status: RequestStatus;
    notes?: string | null;
    changed_by_user_id: number;
    created_at: string;
    changed_by?: User;
}

export interface AssistanceRequest {
    id: number;
    requester_id: number;
    donor_user_id: number;
    donor_card_id: number;
    blood_type_needed: BloodType;
    units_needed: number;
    urgency: 'critical' | 'urgent' | 'standard';
    needed_date: string;
    hospital_name: string;
    hospital_address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    distance_km?: number | null;
    message: string;
    status: RequestStatus;
    rejection_reason?: string | null;
    accepted_at?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    created_at: string;
    updated_at: string;
    requester?: User;
    donor?: User;
    donor_card?: DonorCard;
    status_histories?: RequestStatusHistory[];
}

export interface HelpmePost {
    id: number;
    user_id: number;
    title: string;
    blood_type_needed: BloodType;
    units_needed: number;
    urgency: HelpmeUrgency;
    needed_date: string;
    hospital_name: string;
    province_id: number | null;
    city_id: number | null;
    barangay_id: number | null;
    location_name?: string | null;
    contact_number: string;
    contact_email?: string | null;
    description: string;
    photo_path?: string | null;
    status: HelpmeStatus;
    rejection_reason?: string | null;
    approved_by?: number | null;
    approved_at?: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    province?: Province | null;
    city?: City | null;
    barangay?: Barangay | null;
}

export interface CommunityComment {
    id: number;
    community_post_id: number;
    user_id: number;
    comment: string;
    created_at: string;
    user?: User;
}

export interface CommunityPost {
    id: number;
    user_id: number;
    title: string;
    category: CommunityCategory;
    content: string;
    image_path?: string | null;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason?: string | null;
    approved_by?: number | null;
    approved_at?: string | null;
    likes_count: number;
    comments_count: number;
    is_liked?: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
    comments?: CommunityComment[];
}

export interface BloodEvent {
    id: number;
    user_id: number;
    title: string;
    organizer: string;
    event_type: EventType;
    description: string;
    banner_path?: string | null;
    event_date: string;
    start_time?: string | null;
    end_time?: string | null;
    venue: string;
    province_id: number | null;
    city_id: number | null;
    barangay_id: number | null;
    latitude?: number | null;
    longitude?: number | null;
    contact_person?: string | null;
    contact_number?: string | null;
    contact_email?: string | null;
    registration_link?: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    rejection_reason?: string | null;
    is_official: boolean;
    approved_by?: number | null;
    approved_at?: string | null;
    created_at: string;
    user?: User;
    province?: Province | null;
    city?: City | null;
    barangay?: Barangay | null;
}

export interface InAppNotification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: string;
    link?: string | null;
    read_at?: string | null;
    created_at: string;
}

export interface ContentReport {
    id: number;
    reporter_id: number;
    reportable_type: 'user' | 'helpme_post' | 'community_post' | 'blood_event';
    reportable_id: number;
    reason: string;
    details?: string | null;
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    admin_notes?: string | null;
    created_at: string;
    reporter?: User;
}

export interface AdminAuditLog {
    id: number;
    admin_id: number;
    action: string;
    target_type: string;
    target_id?: number | null;
    description: string;
    ip_address?: string | null;
    created_at: string;
    admin?: User;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface SharedProps {
    name: string;
    auth: {
        user: User | null;
    };
    flash: {
        success?: string | null;
        error?: string | null;
        info?: string | null;
    };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

