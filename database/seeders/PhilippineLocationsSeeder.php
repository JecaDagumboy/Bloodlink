<?php

namespace Database\Seeders;

use App\Models\Barangay;
use App\Models\City;
use App\Models\Province;
use App\Models\Region;
use Illuminate\Database\Seeder;

class PhilippineLocationsSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            [
                'code' => 'NCR',
                'name' => 'National Capital Region',
                'region_name' => 'Metro Manila',
                'provinces' => [
                    [
                        'name' => 'Metro Manila',
                        'cities' => [
                            [
                                'name' => 'Quezon City',
                                'latitude' => 14.6760,
                                'longitude' => 121.0437,
                                'barangays' => [
                                    ['name' => 'Commonwealth', 'lat' => 14.7015, 'lng' => 121.0827],
                                    ['name' => 'Batasan Hills', 'lat' => 14.6853, 'lng' => 121.0991],
                                    ['name' => 'Diliman', 'lat' => 14.6538, 'lng' => 121.0685],
                                    ['name' => 'Holy Spirit', 'lat' => 14.6890, 'lng' => 121.0772],
                                    ['name' => 'Cubao', 'lat' => 14.6195, 'lng' => 121.0515],
                                    ['name' => 'Tandang Sora', 'lat' => 14.6720, 'lng' => 121.0480],
                                    ['name' => 'Kamuning', 'lat' => 14.6304, 'lng' => 121.0392],
                                ],
                            ],
                            [
                                'name' => 'City of Manila',
                                'latitude' => 14.5995,
                                'longitude' => 120.9842,
                                'barangays' => [
                                    ['name' => 'Ermita', 'lat' => 14.5826, 'lng' => 120.9842],
                                    ['name' => 'Malate', 'lat' => 14.5694, 'lng' => 120.9922],
                                    ['name' => 'Sampaloc', 'lat' => 14.6074, 'lng' => 120.9999],
                                    ['name' => 'Santa Mesa', 'lat' => 14.6019, 'lng' => 121.0125],
                                    ['name' => 'Tondo', 'lat' => 14.6288, 'lng' => 120.9678],
                                    ['name' => 'Binondo', 'lat' => 14.6006, 'lng' => 120.9752],
                                ],
                            ],
                            [
                                'name' => 'Makati City',
                                'latitude' => 14.5547,
                                'longitude' => 121.0244,
                                'barangays' => [
                                    ['name' => 'Bel-Air', 'lat' => 14.5615, 'lng' => 121.0267],
                                    ['name' => 'Poblacion', 'lat' => 14.5684, 'lng' => 121.0315],
                                    ['name' => 'San Lorenzo', 'lat' => 14.5492, 'lng' => 121.0203],
                                    ['name' => 'Pio del Pilar', 'lat' => 14.5541, 'lng' => 121.0118],
                                    ['name' => 'Guadalupe Nuevo', 'lat' => 14.5658, 'lng' => 121.0456],
                                ],
                            ],
                            [
                                'name' => 'Taguig City',
                                'latitude' => 14.5176,
                                'longitude' => 121.0509,
                                'barangays' => [
                                    ['name' => 'Fort Bonifacio (BGC)', 'lat' => 14.5505, 'lng' => 121.0505],
                                    ['name' => 'Ususan', 'lat' => 14.5323, 'lng' => 121.0674],
                                    ['name' => 'Tuktukan', 'lat' => 14.5255, 'lng' => 121.0740],
                                    ['name' => 'Western Bicutan', 'lat' => 14.5103, 'lng' => 121.0340],
                                ],
                            ],
                            [
                                'name' => 'Pasig City',
                                'latitude' => 14.5764,
                                'longitude' => 121.0851,
                                'barangays' => [
                                    ['name' => 'Kapitolyo', 'lat' => 14.5721, 'lng' => 121.0598],
                                    ['name' => 'San Antonio (Ortigas)', 'lat' => 14.5847, 'lng' => 121.0617],
                                    ['name' => 'Ugong', 'lat' => 14.5879, 'lng' => 121.0792],
                                    ['name' => 'Maybunga', 'lat' => 14.5779, 'lng' => 121.0921],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'REGION-VII',
                'name' => 'Region VII',
                'region_name' => 'Central Visayas',
                'provinces' => [
                    [
                        'name' => 'Cebu',
                        'cities' => [
                            [
                                'name' => 'Cebu City',
                                'latitude' => 10.3157,
                                'longitude' => 123.8854,
                                'barangays' => [
                                    ['name' => 'Lahug', 'lat' => 10.3344, 'lng' => 123.8966],
                                    ['name' => 'Guadalupe', 'lat' => 10.3235, 'lng' => 123.8767],
                                    ['name' => 'Mabolo', 'lat' => 10.3204, 'lng' => 123.9102],
                                    ['name' => 'Banilad', 'lat' => 10.3458, 'lng' => 123.9122],
                                    ['name' => 'Capitol Site', 'lat' => 10.3175, 'lng' => 123.8906],
                                    ['name' => 'Talamban', 'lat' => 10.3695, 'lng' => 123.9189],
                                ],
                            ],
                            [
                                'name' => 'Mandaue City',
                                'latitude' => 10.3323,
                                'longitude' => 123.9405,
                                'barangays' => [
                                    ['name' => 'Subangdaku', 'lat' => 10.3268, 'lng' => 123.9287],
                                    ['name' => 'Tipolo', 'lat' => 10.3298, 'lng' => 123.9312],
                                    ['name' => 'Bakilid', 'lat' => 10.3340, 'lng' => 123.9398],
                                    ['name' => 'Centro', 'lat' => 10.3275, 'lng' => 123.9442],
                                ],
                            ],
                            [
                                'name' => 'Lapu-Lapu City',
                                'latitude' => 10.3117,
                                'longitude' => 123.9536,
                                'barangays' => [
                                    ['name' => 'Pajo', 'lat' => 10.3195, 'lng' => 123.9621],
                                    ['name' => 'Basak', 'lat' => 10.2882, 'lng' => 123.9685],
                                    ['name' => 'Mactan', 'lat' => 10.3015, 'lng' => 124.0044],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Bohol',
                        'cities' => [
                            [
                                'name' => 'Tagbilaran City',
                                'latitude' => 9.6444,
                                'longitude' => 123.8556,
                                'barangays' => [
                                    ['name' => 'Poblacion I', 'lat' => 9.6490, 'lng' => 123.8540],
                                    ['name' => 'Cogon', 'lat' => 9.6545, 'lng' => 123.8612],
                                    ['name' => 'Dampas', 'lat' => 9.6610, 'lng' => 123.8690],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'REGION-XI',
                'name' => 'Region XI',
                'region_name' => 'Davao Region',
                'provinces' => [
                    [
                        'name' => 'Davao del Sur',
                        'cities' => [
                            [
                                'name' => 'Davao City',
                                'latitude' => 7.0707,
                                'longitude' => 125.6087,
                                'barangays' => [
                                    ['name' => 'Buhangin', 'lat' => 7.1086, 'lng' => 125.6179],
                                    ['name' => 'Poblacion', 'lat' => 7.0667, 'lng' => 125.6000],
                                    ['name' => 'Matina Crossing', 'lat' => 7.0583, 'lng' => 125.5833],
                                    ['name' => 'Bajada', 'lat' => 7.0917, 'lng' => 125.6111],
                                    ['name' => 'Toril', 'lat' => 7.0200, 'lng' => 125.4980],
                                    ['name' => 'Sasa', 'lat' => 7.1250, 'lng' => 125.6560],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'CAR',
                'name' => 'Cordillera Administrative Region',
                'region_name' => 'Cordillera',
                'provinces' => [
                    [
                        'name' => 'Benguet',
                        'cities' => [
                            [
                                'name' => 'Baguio City',
                                'latitude' => 16.4023,
                                'longitude' => 120.5960,
                                'barangays' => [
                                    ['name' => 'Session Road Area', 'lat' => 16.4125, 'lng' => 120.5975],
                                    ['name' => 'Camp 7', 'lat' => 16.3810, 'lng' => 120.6030],
                                    ['name' => 'Loakan Proper', 'lat' => 16.3680, 'lng' => 120.6190],
                                    ['name' => 'Trancoville', 'lat' => 16.4250, 'lng' => 120.6010],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'REGION-VI',
                'name' => 'Region VI',
                'region_name' => 'Western Visayas',
                'provinces' => [
                    [
                        'name' => 'Iloilo',
                        'cities' => [
                            [
                                'name' => 'Iloilo City',
                                'latitude' => 10.7202,
                                'longitude' => 122.5621,
                                'barangays' => [
                                    ['name' => 'Mandurriao', 'lat' => 10.7180, 'lng' => 122.5450],
                                    ['name' => 'Jaro', 'lat' => 10.7330, 'lng' => 122.5620],
                                    ['name' => 'Molo', 'lat' => 10.6970, 'lng' => 122.5400],
                                    ['name' => 'City Proper', 'lat' => 10.6950, 'lng' => 122.5680],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Negros Occidental',
                        'cities' => [
                            [
                                'name' => 'Bacolod City',
                                'latitude' => 10.6766,
                                'longitude' => 122.9509,
                                'barangays' => [
                                    ['name' => 'Mandalagan', 'lat' => 10.6950, 'lng' => 122.9610],
                                    ['name' => 'Villamonte', 'lat' => 10.6780, 'lng' => 122.9680],
                                    ['name' => 'Singcang-Airport', 'lat' => 10.6480, 'lng' => 122.9420],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'REGION-III',
                'name' => 'Region III',
                'region_name' => 'Central Luzon',
                'provinces' => [
                    [
                        'name' => 'Pampanga',
                        'cities' => [
                            [
                                'name' => 'Angeles City',
                                'latitude' => 15.1450,
                                'longitude' => 120.5887,
                                'barangays' => [
                                    ['name' => 'Balibago', 'lat' => 15.1610, 'lng' => 120.5900],
                                    ['name' => 'Malabanias', 'lat' => 15.1580, 'lng' => 120.5790],
                                    ['name' => 'Cutcut', 'lat' => 15.1380, 'lng' => 120.5760],
                                ],
                            ],
                            [
                                'name' => 'San Fernando City',
                                'latitude' => 15.0298,
                                'longitude' => 120.6896,
                                'barangays' => [
                                    ['name' => 'Dolores', 'lat' => 15.0380, 'lng' => 120.6790],
                                    ['name' => 'San Agustin', 'lat' => 15.0450, 'lng' => 120.6870],
                                    ['name' => 'Sindalan', 'lat' => 15.0680, 'lng' => 120.6690],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'REGION-IV-A',
                'name' => 'Region IV-A',
                'region_name' => 'CALABARZON',
                'provinces' => [
                    [
                        'name' => 'Cavite',
                        'cities' => [
                            [
                                'name' => 'Dasmariñas City',
                                'latitude' => 14.3294,
                                'longitude' => 120.9367,
                                'barangays' => [
                                    ['name' => 'Salitran', 'lat' => 14.3410, 'lng' => 120.9410],
                                    ['name' => 'Burol Main', 'lat' => 14.3180, 'lng' => 120.9520],
                                    ['name' => 'Paliparan', 'lat' => 14.2880, 'lng' => 120.9830],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Laguna',
                        'cities' => [
                            [
                                'name' => 'Santa Rosa City',
                                'latitude' => 14.3122,
                                'longitude' => 121.1114,
                                'barangays' => [
                                    ['name' => 'Balibago', 'lat' => 14.2980, 'lng' => 121.1080],
                                    ['name' => 'Don Jose', 'lat' => 14.2690, 'lng' => 121.0720],
                                    ['name' => 'Tagapo', 'lat' => 14.3210, 'lng' => 121.1160],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'code' => 'REGION-X',
                'name' => 'Region X',
                'region_name' => 'Northern Mindanao',
                'provinces' => [
                    [
                        'name' => 'Misamis Oriental',
                        'cities' => [
                            [
                                'name' => 'Cagayan de Oro City',
                                'latitude' => 8.4822,
                                'longitude' => 124.6472,
                                'barangays' => [
                                    ['name' => 'Carmen', 'lat' => 8.4830, 'lng' => 124.6360],
                                    ['name' => 'Nazareth', 'lat' => 8.4720, 'lng' => 124.6480],
                                    ['name' => 'Lapasan', 'lat' => 8.4900, 'lng' => 124.6620],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($locations as $regionData) {
            $region = Region::create([
                'code' => $regionData['code'],
                'name' => $regionData['name'],
                'region_name' => $regionData['region_name'],
            ]);

            foreach ($regionData['provinces'] as $provData) {
                $province = Province::create([
                    'region_id' => $region->id,
                    'name' => $provData['name'],
                ]);

                foreach ($provData['cities'] as $cityData) {
                    $city = City::create([
                        'province_id' => $province->id,
                        'name' => $cityData['name'],
                        'is_city' => true,
                        'latitude' => $cityData['latitude'],
                        'longitude' => $cityData['longitude'],
                    ]);

                    foreach ($cityData['barangays'] as $brgyData) {
                        Barangay::create([
                            'city_id' => $city->id,
                            'name' => $brgyData['name'],
                            'latitude' => $brgyData['lat'],
                            'longitude' => $brgyData['lng'],
                        ]);
                    }
                }
            }
        }
    }
}

