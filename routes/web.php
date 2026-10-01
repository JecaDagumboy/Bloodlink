<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AssistanceRequestController;
use App\Http\Controllers\BloodCardController;
use App\Http\Controllers\BloodEventController;
use App\Http\Controllers\CommunityPostController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonorSearchController;
use App\Http\Controllers\GlobalSearchController;
use App\Http\Controllers\HelpmeController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureUserActive;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public & Guest Routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/register', [\App\Http\Controllers\AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
});


// Location Cascading API
Route::prefix('api/locations')->group(function () {
    Route::get('/regions', [LocationController::class, 'getRegions'])->name('locations.regions');
    Route::get('/provinces', [LocationController::class, 'getProvinces'])->name('locations.provinces');
    Route::get('/cities', [LocationController::class, 'getCities'])->name('locations.cities');
    Route::get('/barangays', [LocationController::class, 'getBarangays'])->name('locations.barangays');
});

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', EnsureUserActive::class])->group(function () {
    // Dashboard
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Global Search
    Route::get('/search', [GlobalSearchController::class, 'index'])->name('search');

    // Donors & Nearby Search
    Route::get('/donors', [DonorSearchController::class, 'index'])->name('donors.index');
    Route::get('/donors/{id}', [DonorSearchController::class, 'show'])->name('donors.show');

    // My Blood Card & Availability
    Route::get('/my-blood-card', [BloodCardController::class, 'show'])->name('blood-card.show');
    Route::post('/my-blood-card/toggle', [BloodCardController::class, 'toggleAvailability'])->name('blood-card.toggle');
    Route::put('/my-blood-card', [BloodCardController::class, 'update'])->name('blood-card.update');
    Route::post('/my-blood-card/verify', [BloodCardController::class, 'requestVerification'])->name('blood-card.verify');

    // Requests / Borrow Workflow
    Route::get('/requests', [AssistanceRequestController::class, 'index'])->name('requests.index');
    Route::post('/requests', [AssistanceRequestController::class, 'store'])->name('requests.store');
    Route::get('/requests/{id}', [AssistanceRequestController::class, 'show'])->name('requests.show');
    Route::post('/requests/{id}/accept', [AssistanceRequestController::class, 'accept'])->name('requests.accept');
    Route::post('/requests/{id}/reject', [AssistanceRequestController::class, 'reject'])->name('requests.reject');
    Route::post('/requests/{id}/cancel', [AssistanceRequestController::class, 'cancel'])->name('requests.cancel');
    Route::post('/requests/{id}/complete', [AssistanceRequestController::class, 'complete'])->name('requests.complete');

    // HelpMe Emergency Posts
    Route::get('/helpme', [HelpmeController::class, 'index'])->name('helpme.index');
    Route::get('/helpme/create', [HelpmeController::class, 'create'])->name('helpme.create');
    Route::post('/helpme', [HelpmeController::class, 'store'])->name('helpme.store');
    Route::get('/helpme/{id}', [HelpmeController::class, 'show'])->name('helpme.show');

    // Community Posts
    Route::get('/posts', [CommunityPostController::class, 'index'])->name('posts.index');
    Route::post('/posts', [CommunityPostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{id}', [CommunityPostController::class, 'show'])->name('posts.show');
    Route::post('/posts/{id}/comment', [CommunityPostController::class, 'storeComment'])->name('posts.comment');
    Route::post('/posts/{id}/like', [CommunityPostController::class, 'toggleLike'])->name('posts.like');

    // Blood Events & Announcements
    Route::get('/events', [BloodEventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [BloodEventController::class, 'create'])->name('events.create');
    Route::post('/events', [BloodEventController::class, 'store'])->name('events.store');
    Route::get('/events/{id}', [BloodEventController::class, 'show'])->name('events.show');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    // Profiles
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.me');
    Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings/account', [SettingsController::class, 'updateAccount'])->name('settings.account');
    Route::put('/settings/security', [SettingsController::class, 'updateSecurity'])->name('settings.security');
    Route::put('/settings/privacy', [SettingsController::class, 'updatePrivacy'])->name('settings.privacy');
    Route::put('/settings/appearance', [SettingsController::class, 'updateAppearance'])->name('settings.appearance');
    Route::put('/settings/notifications', [SettingsController::class, 'updateNotifications'])->name('settings.notifications');
    Route::delete('/settings/account', [SettingsController::class, 'deleteAccount'])->name('settings.delete-account');

    // Content Reporting
    Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
});

/*
|--------------------------------------------------------------------------
| Admin Moderation & Dashboard Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth', EnsureAdmin::class])->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::post('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('admin.users.toggle-status');
    Route::get('/verifications', [AdminController::class, 'verifications'])->name('admin.verifications');
    Route::post('/verifications/{id}/approve', [AdminController::class, 'approveVerification'])->name('admin.verifications.approve');
    Route::post('/verifications/{id}/reject', [AdminController::class, 'rejectVerification'])->name('admin.verifications.reject');
    Route::get('/helpme', [AdminController::class, 'helpmeModeration'])->name('admin.helpme');
    Route::post('/helpme/{id}/approve', [AdminController::class, 'approveHelpme'])->name('admin.helpme.approve');
    Route::post('/helpme/{id}/reject', [AdminController::class, 'rejectHelpme'])->name('admin.helpme.reject');
    Route::get('/community', [AdminController::class, 'communityModeration'])->name('admin.community');
    Route::post('/community/{id}/approve', [AdminController::class, 'approveCommunity'])->name('admin.community.approve');
    Route::post('/community/{id}/reject', [AdminController::class, 'rejectCommunity'])->name('admin.community.reject');
    Route::get('/events', [AdminController::class, 'eventsModeration'])->name('admin.events');
    Route::post('/events/{id}/approve', [AdminController::class, 'approveEvent'])->name('admin.events.approve');
    Route::post('/events/{id}/reject', [AdminController::class, 'rejectEvent'])->name('admin.events.reject');
    Route::get('/requests', [AdminController::class, 'requestsOverview'])->name('admin.requests');
    Route::get('/reports', [AdminController::class, 'reports'])->name('admin.reports');
    Route::post('/reports/{id}/resolve', [AdminController::class, 'resolveReport'])->name('admin.reports.resolve');
    Route::get('/audit-logs', [AdminController::class, 'auditLogs'])->name('admin.audit-logs');
});

