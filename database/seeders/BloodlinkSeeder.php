<?php

namespace Database\Seeders;

use App\Models\AdminAuditLog;
use App\Models\AssistanceRequest;
use App\Models\Barangay;
use App\Models\BloodEvent;
use App\Models\City;
use App\Models\CommunityComment;
use App\Models\CommunityPost;
use App\Models\CommunityPostLike;
use App\Models\DonorCard;
use App\Models\HelpmePost;
use App\Models\InAppNotification;
use App\Models\Province;
use App\Models\Region;
use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class BloodlinkSeeder extends Seeder
{
    public function run(): void
    {
        // Find cities & barangays from PhilippineLocationsSeeder
        $qc = City::where('name', 'Quezon City')->first();
        $qcBrgy = Barangay::where('city_id', $qc?->id)->where('name', 'Commonwealth')->first() ?? $qc?->barangays()->first();
        $qcProvince = $qc?->province;
        $ncr = $qcProvince?->region;

        $cebuCity = City::where('name', 'Cebu City')->first();
        $cebuBrgy = Barangay::where('city_id', $cebuCity?->id)->where('name', 'Lahug')->first() ?? $cebuCity?->barangays()->first();
        $cebuProvince = $cebuCity?->province;

        $davaoCity = City::where('name', 'Davao City')->first();
        $davaoBrgy = Barangay::where('city_id', $davaoCity?->id)->where('name', 'Buhangin')->first() ?? $davaoCity?->barangays()->first();
        $davaoProvince = $davaoCity?->province;

        $baguioCity = City::where('name', 'Baguio City')->first();
        $baguioBrgy = Barangay::where('city_id', $baguioCity?->id)->first();
        $baguioProvince = $baguioCity?->province;

        $iloiloCity = City::where('name', 'Iloilo City')->first();
        $iloiloBrgy = Barangay::where('city_id', $iloiloCity?->id)->first();
        $iloiloProvince = $iloiloCity?->province;

        $manilaCity = City::where('name', 'City of Manila')->first();
        $manilaBrgy = Barangay::where('city_id', $manilaCity?->id)->first();

        $taguigCity = City::where('name', 'Taguig City')->first();
        $taguigBrgy = Barangay::where('city_id', $taguigCity?->id)->first();

        $password = Hash::make('Password123!');

        // 1. Admin User
        $admin = User::create([
            'first_name' => 'System',
            'last_name' => 'Administrator',
            'name' => 'System Administrator',
            'email' => 'admin@bloodlink.ph',
            'phone' => '09170000001',
            'date_of_birth' => '1988-06-15',
            'gender' => 'prefer_not_to_say',
            'blood_type' => 'O+',
            'role' => 'admin',
            'status' => 'active',
            'bio' => 'Official BloodLink Platform Administrator and Healthcare Coordinator.',
            'region_id' => $ncr?->id,
            'province_id' => $qcProvince?->id,
            'city_id' => $qc?->id,
            'barangay_id' => $qcBrgy?->id,
            'address' => 'National Kidney and Transplant Institute Ave, Diliman, Quezon City',
            'latitude' => 14.6477,
            'longitude' => 121.0475,
            'password' => $password,
            'email_verified_at' => now(),
        ]);

        UserSetting::create([
            'user_id' => $admin->id,
            'theme' => 'system',
            'show_phone' => true,
            'location_privacy' => 'approximate',
            'show_donor_availability' => true,
            'profile_visibility' => 'public',
        ]);

        // 2. Regular Requester User: Pedro Reyes
        $pedro = User::create([
            'first_name' => 'Pedro',
            'last_name' => 'Reyes',
            'name' => 'Pedro Reyes',
            'email' => 'pedro.reyes@bloodlink.ph',
            'phone' => '09175550101',
            'date_of_birth' => '1992-04-12',
            'gender' => 'male',
            'blood_type' => 'O+',
            'role' => 'user',
            'status' => 'active',
            'bio' => 'Community member based in Quezon City.',
            'region_id' => $ncr?->id,
            'province_id' => $qcProvince?->id,
            'city_id' => $qc?->id,
            'barangay_id' => $qcBrgy?->id,
            'address' => 'Brgy. Commonwealth, Quezon City',
            'latitude' => 14.7015,
            'longitude' => 121.0827,
            'password' => $password,
            'email_verified_at' => now(),
        ]);

        UserSetting::create([
            'user_id' => $pedro->id,
            'theme' => 'system',
            'show_phone' => true,
            'location_privacy' => 'approximate',
            'show_donor_availability' => false,
            'profile_visibility' => 'users_only',
        ]);

        // 3. Donors with all 8 blood types
        $donorsData = [
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'email' => 'maria.santos@bloodlink.ph',
                'phone' => '09171234567',
                'blood_type' => 'O+',
                'city' => $qc,
                'brgy' => $qcBrgy,
                'province' => $qcProvince,
                'region' => $ncr,
                'card_num' => 'BL-DONOR-2026-0001',
                'donations' => 8,
                'emergency_ready' => true,
                'last_donated' => Carbon::now()->subMonths(3)->toDateString(),
                'bio' => 'Regular volunteer blood donor since 2021. Happy to coordinate with blood banks and hospitals in Metro Manila.',
            ],
            [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'email' => 'juan.delacruz@bloodlink.ph',
                'phone' => '09189876543',
                'blood_type' => 'A+',
                'city' => $cebuCity,
                'brgy' => $cebuBrgy,
                'province' => $cebuProvince,
                'region' => $cebuProvince?->region,
                'card_num' => 'BL-DONOR-2026-0002',
                'donations' => 5,
                'emergency_ready' => true,
                'last_donated' => Carbon::now()->subMonths(4)->toDateString(),
                'bio' => 'Active Cebu Red Cross volunteer donor. Available for coordination across Central Visayas.',
            ],
            [
                'first_name' => 'Dr. Aris',
                'last_name' => 'Bautista',
                'email' => 'aris.bautista@bloodlink.ph',
                'phone' => '09205551234',
                'blood_type' => 'B+',
                'city' => $davaoCity,
                'brgy' => $davaoBrgy,
                'province' => $davaoProvince,
                'region' => $davaoProvince?->region,
                'card_num' => 'BL-DONOR-2026-0003',
                'donations' => 12,
                'emergency_ready' => true,
                'last_donated' => Carbon::now()->subMonths(2)->toDateString(),
                'bio' => 'Physician and regular whole blood donor. Always ready for verified hospital coordination in Davao.',
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Geronimo',
                'email' => 'sarah.geronimo@bloodlink.ph',
                'phone' => '09224445555',
                'blood_type' => 'AB+',
                'city' => $baguioCity,
                'brgy' => $baguioBrgy,
                'province' => $baguioProvince,
                'region' => $baguioProvince?->region,
                'card_num' => 'BL-DONOR-2026-0004',
                'donations' => 3,
                'emergency_ready' => false,
                'last_donated' => Carbon::now()->subMonths(5)->toDateString(),
                'bio' => 'Universal recipient donor profile. Ready to assist verified medical cases in Baguio and Benguet.',
            ],
            [
                'first_name' => 'Carlos',
                'last_name' => 'Yulo',
                'email' => 'carlos.yulo@bloodlink.ph',
                'phone' => '09191112222',
                'blood_type' => 'O-',
                'city' => $manilaCity,
                'brgy' => $manilaBrgy,
                'province' => $qcProvince,
                'region' => $ncr,
                'card_num' => 'BL-DONOR-2026-0005',
                'donations' => 7,
                'emergency_ready' => true,
                'last_donated' => Carbon::now()->subMonths(1)->toDateString(),
                'bio' => 'O-Negative universal red cell donor. High priority availability for pediatric and emergency cases.',
            ],
            [
                'first_name' => 'Bea',
                'last_name' => 'Alonzo',
                'email' => 'bea.alonzo@bloodlink.ph',
                'phone' => '09173334444',
                'blood_type' => 'A-',
                'city' => $iloiloCity,
                'brgy' => $iloiloBrgy,
                'province' => $iloiloProvince,
                'region' => $iloiloProvince?->region,
                'card_num' => 'BL-DONOR-2026-0006',
                'donations' => 4,
                'emergency_ready' => false,
                'last_donated' => Carbon::now()->subMonths(6)->toDateString(),
                'bio' => 'A-Negative blood resource cardholder. Committed to voluntary advocacy in Iloilo.',
            ],
            [
                'first_name' => 'Jericho',
                'last_name' => 'Rosales',
                'email' => 'jericho.rosales@bloodlink.ph',
                'phone' => '09218889999',
                'blood_type' => 'B-',
                'city' => $taguigCity,
                'brgy' => $taguigBrgy,
                'province' => $qcProvince,
                'region' => $ncr,
                'card_num' => 'BL-DONOR-2026-0007',
                'donations' => 6,
                'emergency_ready' => true,
                'last_donated' => Carbon::now()->subMonths(3)->toDateString(),
                'bio' => 'B-Negative verified donor. Based near BGC and Makati medical centers.',
            ],
            [
                'first_name' => 'Liza',
                'last_name' => 'Soberano',
                'email' => 'liza.soberano@bloodlink.ph',
                'phone' => '09187776666',
                'blood_type' => 'AB-',
                'city' => $qc,
                'brgy' => $qcBrgy,
                'province' => $qcProvince,
                'region' => $ncr,
                'card_num' => 'BL-DONOR-2026-0008',
                'donations' => 2,
                'emergency_ready' => false,
                'last_donated' => Carbon::now()->subMonths(4)->toDateString(),
                'bio' => 'AB-Negative rare blood donor profile. Promoting safe, verified donation coordination.',
            ],
        ];

        $createdDonors = [];

        foreach ($donorsData as $d) {
            $user = User::create([
                'first_name' => $d['first_name'],
                'last_name' => $d['last_name'],
                'name' => $d['first_name'] . ' ' . $d['last_name'],
                'email' => $d['email'],
                'phone' => $d['phone'],
                'date_of_birth' => '1995-08-20',
                'gender' => 'other',
                'blood_type' => $d['blood_type'],
                'role' => 'user',
                'status' => 'active',
                'bio' => $d['bio'],
                'region_id' => $d['region']?->id,
                'province_id' => $d['province']?->id,
                'city_id' => $d['city']?->id,
                'barangay_id' => $d['brgy']?->id,
                'address' => $d['city']?->name . ', Philippines',
                'latitude' => $d['brgy']?->latitude ?? $d['city']?->latitude,
                'longitude' => $d['brgy']?->longitude ?? $d['city']?->longitude,
                'password' => $password,
                'email_verified_at' => now(),
            ]);

            $donorCard = DonorCard::create([
                'user_id' => $user->id,
                'blood_type' => $d['blood_type'],
                'is_available' => true,
                'verification_status' => 'verified',
                'verified_at' => now()->subMonths(1),
                'verified_by' => $admin->id,
                'donor_card_number' => $d['card_num'],
                'search_radius_km' => 30,
                'preferred_contact_method' => 'both',
                'emergency_ready' => $d['emergency_ready'],
                'last_donation_date' => $d['last_donated'],
                'total_donations_count' => $d['donations'],
                'notes' => 'Verified donor record. Screened by BloodLink administration in coordination with local blood bank standards.',
            ]);

            UserSetting::create([
                'user_id' => $user->id,
                'theme' => 'system',
                'show_phone' => true,
                'location_privacy' => 'approximate',
                'show_donor_availability' => true,
                'profile_visibility' => 'public',
            ]);

            $createdDonors[$d['blood_type']] = ['user' => $user, 'card' => $donorCard];
        }

        // 4. Sample Assistance Requests
        $maria = $createdDonors['O+']['user'];
        $mariaCard = $createdDonors['O+']['card'];

        $carlos = $createdDonors['O-']['user'];
        $carlosCard = $createdDonors['O-']['card'];

        $juan = $createdDonors['A+']['user'];
        $juanCard = $createdDonors['A+']['card'];

        // Request 1: Active/Accepted Coordination
        $req1 = AssistanceRequest::create([
            'requester_id' => $pedro->id,
            'donor_user_id' => $maria->id,
            'donor_card_id' => $mariaCard->id,
            'blood_type_needed' => 'O+',
            'units_needed' => 2,
            'urgency' => 'urgent',
            'needed_date' => Carbon::now()->addDays(2)->toDateString(),
            'hospital_name' => 'Philippine Heart Center',
            'hospital_address' => 'East Avenue, Diliman, Quezon City',
            'latitude' => 14.6436,
            'longitude' => 121.0483,
            'distance_km' => 6.8,
            'message' => 'Hello Maria, we are coordinating blood assistance for my father scheduled for bypass surgery at Philippine Heart Center. The hospital blood bank requires 2 replacement donors. We would appreciate your coordination.',
            'status' => 'accepted',
            'accepted_at' => Carbon::now()->subHours(5),
        ]);

        $req1->statusHistories()->create([
            'status' => 'pending',
            'notes' => 'Assistance request initiated by Pedro Reyes.',
            'changed_by_user_id' => $pedro->id,
        ]);
        $req1->statusHistories()->create([
            'status' => 'accepted',
            'notes' => 'Maria Santos accepted coordination. Coordination in progress; donor contact shared.',
            'changed_by_user_id' => $maria->id,
        ]);

        // Request 2: Completed Request with Carlos
        $req2 = AssistanceRequest::create([
            'requester_id' => $pedro->id,
            'donor_user_id' => $carlos->id,
            'donor_card_id' => $carlosCard->id,
            'blood_type_needed' => 'O-',
            'units_needed' => 1,
            'urgency' => 'critical',
            'needed_date' => Carbon::now()->subDays(10)->toDateString(),
            'hospital_name' => 'Philippine General Hospital (PGH)',
            'hospital_address' => 'Taft Ave, Ermita, Manila',
            'latitude' => 14.5778,
            'longitude' => 120.9856,
            'distance_km' => 12.4,
            'message' => 'Urgent replacement donor needed for emergency transfusion at PGH. Thank you for your verified card record.',
            'status' => 'completed',
            'accepted_at' => Carbon::now()->subDays(11),
            'completed_at' => Carbon::now()->subDays(9),
        ]);

        $req2->statusHistories()->create([
            'status' => 'completed',
            'notes' => 'Transfusion coordination successfully concluded and verified by hospital blood bank protocol.',
            'changed_by_user_id' => $pedro->id,
        ]);

        // Request 3: Pending Request with Juan Dela Cruz
        $req3 = AssistanceRequest::create([
            'requester_id' => $pedro->id,
            'donor_user_id' => $juan->id,
            'donor_card_id' => $juanCard->id,
            'blood_type_needed' => 'A+',
            'units_needed' => 1,
            'urgency' => 'standard',
            'needed_date' => Carbon::now()->addDays(5)->toDateString(),
            'hospital_name' => 'Chong Hua Hospital Mandaue',
            'hospital_address' => 'Mandaue City, Cebu',
            'latitude' => 10.3235,
            'longitude' => 123.9312,
            'distance_km' => 572.0,
            'message' => 'Inquiring for a relative in Cebu who will undergo hip replacement surgery next week.',
            'status' => 'pending',
        ]);

        // 5. HelpMe Emergency Posts
        HelpmePost::create([
            'user_id' => $pedro->id,
            'title' => 'URGENT: 2 Units O+ Whole Blood for Cardiovascular Surgery',
            'blood_type_needed' => 'O+',
            'units_needed' => 2,
            'urgency' => 'critical',
            'needed_date' => Carbon::now()->addDays(3)->toDateString(),
            'hospital_name' => 'Philippine Heart Center',
            'province_id' => $qcProvince?->id,
            'city_id' => $qc?->id,
            'barangay_id' => $qcBrgy?->id,
            'location_name' => 'East Avenue, Quezon City',
            'contact_number' => '09175550101',
            'contact_email' => 'pedro.reyes@bloodlink.ph',
            'description' => 'Our 62-year-old father is scheduled for open heart surgery. The blood bank needs replacement O+ donors by Thursday morning. Blood screening will be conducted directly by the hospital blood bank team.',
            'status' => 'approved',
            'approved_by' => $admin->id,
            'approved_at' => now()->subDay(),
        ]);

        HelpmePost::create([
            'user_id' => $juan->id,
            'title' => 'Immediate Need: A- Platelet Apheresis for Dengue Patient in Cebu',
            'blood_type_needed' => 'A-',
            'units_needed' => 1,
            'urgency' => 'critical',
            'needed_date' => Carbon::now()->addDays(1)->toDateString(),
            'hospital_name' => 'Cebu Doctors University Hospital',
            'province_id' => $cebuProvince?->id,
            'city_id' => $cebuCity?->id,
            'barangay_id' => $cebuBrgy?->id,
            'location_name' => 'Gov. M. Roa St, Cebu City',
            'contact_number' => '09189876543',
            'contact_email' => 'juan.delacruz@bloodlink.ph',
            'description' => 'Platelet count dropped critically to 18,000 for a severe dengue case. CDUH blood bank is currently low on A- platelets. Please reach out if you are an eligible A- donor in Cebu.',
            'status' => 'approved',
            'approved_by' => $admin->id,
            'approved_at' => now()->subHours(12),
        ]);

        HelpmePost::create([
            'user_id' => $maria->id,
            'title' => 'Scheduled Need: 3 Units B+ for Orthopedic Procedure at SPMC',
            'blood_type_needed' => 'B+',
            'units_needed' => 3,
            'urgency' => 'urgent',
            'needed_date' => Carbon::now()->addDays(6)->toDateString(),
            'hospital_name' => 'Southern Philippines Medical Center (SPMC)',
            'province_id' => $davaoProvince?->id,
            'city_id' => $davaoCity?->id,
            'barangay_id' => $davaoBrgy?->id,
            'location_name' => 'JP Laurel Ave, Bajada, Davao City',
            'contact_number' => '09205551234',
            'contact_email' => 'spmc.assistance@bloodlink.ph',
            'description' => 'Coordinating replacement donors for upcoming orthopedic reconstruction surgery at SPMC. Donors can visit the SPMC Blood Bank 8am to 4pm.',
            'status' => 'approved',
            'approved_by' => $admin->id,
            'approved_at' => now()->subHours(6),
        ]);

        // Pending HelpMe post for moderation queue
        HelpmePost::create([
            'user_id' => $carlos->id,
            'title' => 'Urgent: AB- Plasma Needed for Medical ICU Patient',
            'blood_type_needed' => 'AB-',
            'units_needed' => 2,
            'urgency' => 'critical',
            'needed_date' => Carbon::now()->addDays(2)->toDateString(),
            'hospital_name' => 'St. Luke’s Medical Center - Global City',
            'province_id' => $qcProvince?->id,
            'city_id' => $taguigCity?->id,
            'barangay_id' => $taguigBrgy?->id,
            'location_name' => '32nd St, BGC, Taguig',
            'contact_number' => '09191112222',
            'contact_email' => 'carlos.yulo@bloodlink.ph',
            'description' => 'Awaiting admin review. Patient in ICU requires rare AB- negative plasma replacement.',
            'status' => 'pending',
        ]);

        // 6. Blood Events / Announcements
        BloodEvent::create([
            'user_id' => $admin->id,
            'title' => 'Philippine Red Cross Metro Manila Grand Blood Drive 2026',
            'organizer' => 'Philippine Red Cross - National Headquarters',
            'event_type' => 'blood_drive',
            'description' => 'Join our annual national voluntary blood donation drive. Professional medical staff will conduct on-site health screening, hemoglobin testing, and safe donation procedures. All blood types are welcome, especially rare O- and AB- types.',
            'event_date' => Carbon::now()->addDays(4)->toDateString(),
            'start_time' => '08:00 AM',
            'end_time' => '05:00 PM',
            'venue' => 'Quezon Memorial Circle - Liwasang Aurora, Quezon City',
            'province_id' => $qcProvince?->id,
            'city_id' => $qc?->id,
            'barangay_id' => $qcBrgy?->id,
            'latitude' => 14.6515,
            'longitude' => 121.0494,
            'contact_person' => 'Red Cross Blood Services Coordinator',
            'contact_number' => '143 / (02) 8790-2300',
            'contact_email' => 'bloodservices@redcross.org.ph',
            'registration_link' => 'https://redcross.org.ph/give-blood/',
            'status' => 'approved',
            'is_official' => true,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);

        BloodEvent::create([
            'user_id' => $admin->id,
            'title' => 'Cebu Central Visayas Voluntary Blood Donation Caravan',
            'organizer' => 'Department of Health Region VII Blood Center',
            'event_type' => 'hospital_drive',
            'description' => 'A joint regional blood drive between DOH-7, Vicente Sotto Memorial Medical Center, and BloodLink community partners to augment blood bank reserves for summer emergency preparedness.',
            'event_date' => Carbon::now()->addDays(8)->toDateString(),
            'start_time' => '09:00 AM',
            'end_time' => '04:00 PM',
            'venue' => 'SM City Cebu - Trade Hall 2, North Reclamation Area, Cebu City',
            'province_id' => $cebuProvince?->id,
            'city_id' => $cebuCity?->id,
            'barangay_id' => $cebuBrgy?->id,
            'latitude' => 10.3117,
            'longitude' => 123.9180,
            'contact_person' => 'DOH-7 Blood Bank Unit',
            'contact_number' => '(032) 253-6355',
            'contact_email' => 'doh7.blood@doh.gov.ph',
            'registration_link' => 'https://ro7.doh.gov.ph',
            'status' => 'approved',
            'is_official' => true,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);

        BloodEvent::create([
            'user_id' => $juan->id,
            'title' => 'Davao City Youth for Life Voluntary Blood Drive',
            'organizer' => 'Rotary Club of East Davao & SPMC Blood Bank',
            'event_type' => 'blood_drive',
            'description' => 'Community-led youth blood drive encouraging young adults aged 18-30 to donate blood. Free refreshments, donor pins, and health certificates provided.',
            'event_date' => Carbon::now()->addDays(12)->toDateString(),
            'start_time' => '08:30 AM',
            'end_time' => '03:30 PM',
            'venue' => 'Abreeza Ayala Mall Activity Hall, Bajada, Davao City',
            'province_id' => $davaoProvince?->id,
            'city_id' => $davaoCity?->id,
            'barangay_id' => $davaoBrgy?->id,
            'latitude' => 7.0917,
            'longitude' => 125.6111,
            'contact_person' => 'Rotary Community Chair',
            'contact_number' => '09205551234',
            'contact_email' => 'davao.rotary@gmail.com',
            'status' => 'approved',
            'is_official' => false,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);

        // 7. Community Posts
        $post1 = CommunityPost::create([
            'user_id' => $maria->id,
            'title' => 'My 8th Blood Donation Journey: Overcoming the Fear of Needles to Save Lives',
            'category' => 'story',
            'content' => "When I first registered as a donor, I was terrified of needles. But after seeing how critical blood availability was when my aunt had complications during childbirth, I decided to step up.\n\nYesterday was my 8th donation at the Philippine Heart Center blood bank. The phlebotomist was wonderful, and the whole procedure took less than 15 minutes! To anyone hesitating: you are giving someone a second chance at life. Drink plenty of water and rest well the night before!",
            'status' => 'approved',
            'approved_by' => $admin->id,
            'approved_at' => now()->subDays(2),
            'likes_count' => 14,
            'comments_count' => 2,
        ]);

        CommunityComment::create([
            'community_post_id' => $post1->id,
            'user_id' => $pedro->id,
            'comment' => 'Thank you for your advocacy, Maria! Donors like you are true everyday heroes.',
        ]);
        CommunityComment::create([
            'community_post_id' => $post1->id,
            'user_id' => $juan->id,
            'comment' => 'Great advice on hydration. Congratulations on your 8th milestone!',
        ]);

        CommunityPostLike::create([
            'community_post_id' => $post1->id,
            'user_id' => $pedro->id,
        ]);
        CommunityPostLike::create([
            'community_post_id' => $post1->id,
            'user_id' => $admin->id,
        ]);

        $post2 = CommunityPost::create([
            'user_id' => $admin->id,
            'title' => 'Safety Notice: What "Blood Card Availability" Really Means on BloodLink',
            'category' => 'advocacy',
            'content' => "Important Safety & Ethical Guidelines:\n\n1. BloodLink does NOT permit impersonating another person or presenting another individual's medical identification as your own.\n2. A BloodLink Blood Card represents a verified donor or community resource profile who is available for direct coordination.\n3. The platform does NOT replace hospital protocols, blood typing, cross-matching, or official transfusion approvals. All medical determinations remain strictly under licensed healthcare facilities.\n\nThank you for helping us maintain a transparent and trustworthy network.",
            'status' => 'approved',
            'approved_by' => $admin->id,
            'approved_at' => now()->subDays(5),
            'likes_count' => 38,
            'comments_count' => 1,
        ]);

        CommunityComment::create([
            'community_post_id' => $post2->id,
            'user_id' => $carlos->id,
            'comment' => 'Clear and very essential rule. Ensuring safety protects both donors and patients.',
        ]);

        // Pending Community Post for moderation
        CommunityPost::create([
            'user_id' => $pedro->id,
            'title' => 'Tips for First-Time Blood Donors in Metro Manila',
            'category' => 'tip',
            'content' => 'Here are 5 things I learned during our hospital blood drive: 1. Bring a valid ID. 2. Have a light meal without greasy food. 3. Sleep at least 6 hours. 4. Inform the screening doctor of any medications. 5. Take your time getting up after donating.',
            'status' => 'pending',
        ]);

        // 8. In-App Notifications
        InAppNotification::send(
            $pedro->id,
            'Assistance Request Accepted',
            'Maria Santos has accepted your coordination request for 2 units O+ blood at Philippine Heart Center. Contact information is now accessible.',
            'request',
            '/requests/' . $req1->id
        );

        InAppNotification::send(
            $maria->id,
            'New Coordination Request',
            'Pedro Reyes requested assistance for O+ blood at Philippine Heart Center.',
            'request',
            '/requests/' . $req1->id
        );

        InAppNotification::send(
            $pedro->id,
            'HelpMe Post Approved',
            'Your emergency blood request "URGENT: 2 Units O+ Whole Blood for Cardiovascular Surgery" has been reviewed and approved by the moderator.',
            'approval',
            '/helpme'
        );

        InAppNotification::send(
            $admin->id,
            'New Content Awaiting Moderation',
            'There are pending HelpMe posts and community articles waiting for admin review.',
            'admin',
            '/admin/helpme'
        );

        // 9. Admin Audit Logs
        AdminAuditLog::log(
            $admin->id,
            'VERIFY_DONOR',
            'DonorCard',
            $mariaCard->id,
            'Verified donor card record and blood type confirmation for Maria Santos.'
        );

        AdminAuditLog::log(
            $admin->id,
            'APPROVE_HELPME',
            'HelpmePost',
            1,
            'Approved emergency HelpMe post for Philippine Heart Center cardiovascular surgery.'
        );
    }
}

