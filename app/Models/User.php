<?php

namespace App\Models;

use App\Concerns\HasTeams;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string $email
 * @property string|null $phone
 * @property Carbon|null $date_of_birth
 * @property string|null $gender
 * @property string|null $blood_type
 * @property string $role
 * @property string $status
 * @property string|null $avatar
 * @property string|null $bio
 * @property int|null $region_id
 * @property int|null $province_id
 * @property int|null $city_id
 * @property int|null $barangay_id
 * @property string|null $address
 * @property float|null $latitude
 * @property float|null $longitude
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property int|null $current_team_id
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasTeams, Notifiable;

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'blood_type',
        'role',
        'status',
        'avatar',
        'bio',
        'region_id',
        'province_id',
        'city_id',
        'barangay_id',
        'address',
        'latitude',
        'longitude',
        'password',
        'current_team_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'latitude' => 'float',
            'longitude' => 'float',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    public function donorCard(): HasOne
    {
        return $this->hasOne(DonorCard::class);
    }

    public function settings(): HasOne
    {
        return $this->hasOne(UserSetting::class);
    }

    public function sentRequests(): HasMany
    {
        return $this->hasMany(AssistanceRequest::class, 'requester_id');
    }

    public function receivedRequests(): HasMany
    {
        return $this->hasMany(AssistanceRequest::class, 'donor_user_id');
    }

    public function helpmePosts(): HasMany
    {
        return $this->hasMany(HelpmePost::class);
    }

    public function communityPosts(): HasMany
    {
        return $this->hasMany(CommunityPost::class);
    }

    public function bloodEvents(): HasMany
    {
        return $this->hasMany(BloodEvent::class);
    }

    public function inAppNotifications(): HasMany
    {
        return $this->hasMany(InAppNotification::class);
    }

    public function unreadNotificationsCount(): int
    {
        return $this->inAppNotifications()->whereNull('read_at')->count();
    }

    public function getLocationStringAttribute(): string
    {
        $parts = [];
        if ($this->barangay) {
            $parts[] = 'Brgy. ' . $this->barangay->name;
        }
        if ($this->city) {
            $parts[] = $this->city->name;
        }
        if ($this->province) {
            $parts[] = $this->province->name;
        }
        return count($parts) > 0 ? implode(', ', $parts) : ($this->address ?? 'Philippines');
    }
}

