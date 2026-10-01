<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\City;
use App\Models\Province;
use App\Models\Region;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getRegions(): JsonResponse
    {
        return response()->json(
            Region::query()
                ->orderBy('name')
                ->get(['id', 'code', 'name', 'region_name'])
        );
    }

    public function getProvinces(Request $request): JsonResponse
    {
        $request->validate([
            'region_id' => ['required', 'integer', 'exists:regions,id'],
        ]);

        return response()->json(
            Province::query()
                ->where('region_id', $request->integer('region_id'))
                ->orderBy('name')
                ->get(['id', 'region_id', 'name'])
        );
    }

    public function getCities(Request $request): JsonResponse
    {
        $request->validate([
            'province_id' => ['required', 'integer', 'exists:provinces,id'],
        ]);

        return response()->json(
            City::query()
                ->where('province_id', $request->integer('province_id'))
                ->orderBy('name')
                ->get(['id', 'province_id', 'name', 'is_city', 'latitude', 'longitude'])
        );
    }

    public function getBarangays(Request $request): JsonResponse
    {
        $request->validate([
            'city_id' => ['required', 'integer', 'exists:cities,id'],
        ]);

        return response()->json(
            Barangay::query()
                ->where('city_id', $request->integer('city_id'))
                ->orderBy('name')
                ->get(['id', 'city_id', 'name', 'latitude', 'longitude'])
        );
    }
}
