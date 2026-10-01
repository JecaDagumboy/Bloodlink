<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donor_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('blood_type', 10);
            $table->boolean('is_available')->default(true);
            $table->string('verification_status', 30)->default('pending'); // unverified, pending, verified, rejected, expired
            $table->text('rejection_reason')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('donor_card_number', 50)->nullable()->unique();
            $table->integer('search_radius_km')->default(25);
            $table->string('preferred_contact_method', 20)->default('app'); // app, phone, email, both
            $table->boolean('emergency_ready')->default(false);
            $table->date('last_donation_date')->nullable();
            $table->integer('total_donations_count')->default(0);
            $table->text('notes')->nullable();
            $table->string('id_document_path')->nullable();
            $table->timestamps();

            $table->index(['blood_type', 'is_available', 'verification_status']);
        });

        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('theme', 20)->default('system'); // light, dark, system
            $table->boolean('show_phone')->default(false);
            $table->string('location_privacy', 30)->default('approximate'); // exact, approximate, barangay, city, hidden
            $table->boolean('show_donor_availability')->default(true);
            $table->string('profile_visibility', 20)->default('users_only'); // public, users_only, hidden
            $table->boolean('notify_requests')->default(true);
            $table->boolean('notify_helpme')->default(true);
            $table->boolean('notify_events')->default(true);
            $table->boolean('notify_community')->default(true);
            $table->timestamps();
        });

        Schema::create('assistance_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('donor_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('donor_card_id')->constrained('donor_cards')->cascadeOnDelete();
            $table->string('blood_type_needed', 10);
            $table->integer('units_needed')->default(1);
            $table->string('urgency', 20)->default('urgent'); // critical, urgent, standard
            $table->date('needed_date');
            $table->string('hospital_name');
            $table->text('hospital_address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('distance_km', 8, 2)->nullable();
            $table->text('message');
            $table->string('status', 20)->default('pending'); // pending, accepted, rejected, cancelled, completed, expired
            $table->text('rejection_reason')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index(['requester_id', 'status']);
            $table->index(['donor_user_id', 'status']);
            $table->index('needed_date');
        });

        Schema::create('request_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assistance_request_id')->constrained('assistance_requests')->cascadeOnDelete();
            $table->string('status', 30);
            $table->text('notes')->nullable();
            $table->foreignId('changed_by_user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('helpme_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('blood_type_needed', 10);
            $table->integer('units_needed')->default(1);
            $table->string('urgency', 20)->default('urgent'); // critical, urgent, moderate
            $table->date('needed_date');
            $table->string('hospital_name');
            $table->foreignId('province_id')->nullable()->constrained('provinces')->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('barangay_id')->nullable()->constrained('barangays')->nullOnDelete();
            $table->string('location_name')->nullable();
            $table->string('contact_number', 50);
            $table->string('contact_email')->nullable();
            $table->text('description');
            $table->string('photo_path')->nullable();
            $table->string('status', 20)->default('pending'); // pending, approved, rejected, fulfilled, cancelled
            $table->text('rejection_reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'blood_type_needed']);
            $table->index('needed_date');
        });

        Schema::create('community_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('category', 30)->default('story'); // story, tip, question, advocacy
            $table->text('content');
            $table->string('image_path')->nullable();
            $table->string('status', 20)->default('pending'); // pending, approved, rejected
            $table->text('rejection_reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            $table->timestamps();

            $table->index(['status', 'category']);
        });

        Schema::create('community_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_post_id')->constrained('community_posts')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('comment');
            $table->timestamps();
        });

        Schema::create('community_post_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_post_id')->constrained('community_posts')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['community_post_id', 'user_id']);
        });

        Schema::create('blood_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('organizer');
            $table->string('event_type', 30)->default('blood_drive'); // blood_drive, hospital_drive, advocacy, official_announcement
            $table->text('description');
            $table->string('banner_path')->nullable();
            $table->date('event_date');
            $table->string('start_time', 20)->nullable();
            $table->string('end_time', 20)->nullable();
            $table->string('venue');
            $table->foreignId('province_id')->nullable()->constrained('provinces')->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('barangay_id')->nullable()->constrained('barangays')->nullOnDelete();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_number', 50)->nullable();
            $table->string('contact_email')->nullable();
            $table->string('registration_link')->nullable();
            $table->string('status', 20)->default('pending'); // pending, approved, rejected, completed
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_official')->default(false);
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'event_date']);
        });

        Schema::create('content_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->string('reportable_type');
            $table->unsignedBigInteger('reportable_id');
            $table->string('reason', 50); // spam, false_information, abuse, fraud_scam, misleading_blood_info, inappropriate_content, other
            $table->text('details')->nullable();
            $table->string('status', 20)->default('pending'); // pending, investigating, resolved, dismissed
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['reportable_type', 'reportable_id']);
            $table->index('status');
        });

        Schema::create('admin_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            $table->string('action', 50);
            $table->string('target_type', 50);
            $table->unsignedBigInteger('target_id')->nullable();
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['action', 'created_at']);
        });

        Schema::create('in_app_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->string('type', 30)->default('info');
            $table->string('link')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'read_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('in_app_notifications');
        Schema::dropIfExists('admin_audit_logs');
        Schema::dropIfExists('content_reports');
        Schema::dropIfExists('blood_events');
        Schema::dropIfExists('community_post_likes');
        Schema::dropIfExists('community_comments');
        Schema::dropIfExists('community_posts');
        Schema::dropIfExists('helpme_posts');
        Schema::dropIfExists('request_status_histories');
        Schema::dropIfExists('assistance_requests');
        Schema::dropIfExists('user_settings');
        Schema::dropIfExists('donor_cards');
    }
};

