'use client';

import { useEffect, useState } from 'react';
import type { Region, Province, City, Municipality, Barangay } from '@/types/psgc';

interface AddressFieldsProps {
  formData: {
    region: string;
    regionCode: string;
    province: string;
    provinceCode: string;
    cityMunicipality: string;
    cityMunicipalityCode: string;
    baranggay: string;
  };
  onRegionChange: (code: string, name: string) => void;
  onProvinceChange: (code: string, name: string) => void;
  onCityChange: (code: string, name: string) => void;
  onBarangayChange: (name: string) => void;
}

export default function AddressFields({ 
  formData, 
  onRegionChange, 
  onProvinceChange, 
  onCityChange, 
  onBarangayChange 
}: AddressFieldsProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<(City | Municipality)[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState({
    regions: false,
    provinces: false,
    cities: false,
    barangays: false,
  });
  const [mounted, setMounted] = useState(false);

  // Set mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all regions on mount
  useEffect(() => {
    if (!mounted) return;
    
    const fetchRegions = async () => {
      setLoading(prev => ({ ...prev, regions: true }));
      try {
        const response = await fetch('https://psgc.gitlab.io/api/regions/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Regions fetched:', data.length);
        setRegions(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
        // Set empty array on error so dropdown shows "Select Region"
        setRegions([]);
      } finally {
        setLoading(prev => ({ ...prev, regions: false }));
      }
    };
    fetchRegions();
  }, [mounted]);

  // Fetch provinces when region changes
  useEffect(() => {
    if (formData.regionCode) {
      const fetchProvinces = async () => {
        setLoading(prev => ({ ...prev, provinces: true }));
        setProvinces([]);
        setCities([]);
        setBarangays([]);
        try {
          const response = await fetch(`https://psgc.gitlab.io/api/regions/${formData.regionCode}/provinces/`);
          const data = await response.json();
          setProvinces(data);
        } catch (error) {
          console.error('Error fetching provinces:', error);
        } finally {
          setLoading(prev => ({ ...prev, provinces: false }));
        }
      };
      fetchProvinces();
    } else {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
    }
  }, [formData.regionCode]);

  // Fetch cities when province changes
  useEffect(() => {
    if (formData.provinceCode) {
      const fetchCities = async () => {
        setLoading(prev => ({ ...prev, cities: true }));
        setCities([]);
        setBarangays([]);
        try {
          const response = await fetch(`https://psgc.gitlab.io/api/provinces/${formData.provinceCode}/cities-municipalities/`);
          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error('Error fetching cities:', error);
        } finally {
          setLoading(prev => ({ ...prev, cities: false }));
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setBarangays([]);
    }
  }, [formData.provinceCode]);

  // Fetch barangays when city changes
  useEffect(() => {
    if (formData.cityMunicipalityCode) {
      const fetchBarangays = async () => {
        setLoading(prev => ({ ...prev, barangays: true }));
        setBarangays([]);
        try {
          const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${formData.cityMunicipalityCode}/barangays/`);
          const data = await response.json();
          setBarangays(data);
        } catch (error) {
          console.error('Error fetching barangays:', error);
        } finally {
          setLoading(prev => ({ ...prev, barangays: false }));
        }
      };
      fetchBarangays();
    } else {
      setBarangays([]);
    }
  }, [formData.cityMunicipalityCode]);

  return (
    <>
      {/* Row 2: Region and Province */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Region</label>
          <select
            name="region"
            value={formData.regionCode}
            onChange={(e) => {
              const region = regions.find(r => r.code === e.target.value);
              onRegionChange(e.target.value, region?.name || '');
            }}
            disabled={loading.regions}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading.regions ? 'Loading regions...' : 'Select Region'}
            </option>
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Province</label>
          <select
            name="province"
            value={formData.provinceCode}
            onChange={(e) => {
              const province = provinces.find(p => p.code === e.target.value);
              onProvinceChange(e.target.value, province?.name || '');
            }}
            disabled={!formData.regionCode || loading.provinces}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading.provinces ? 'Loading provinces...' : 'Select Province'}
            </option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: City/Municipality and Baranggay */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">City / Municipality</label>
          <select
            name="cityMunicipality"
            value={formData.cityMunicipalityCode}
            onChange={(e) => {
              const city = cities.find(c => c.code === e.target.value);
              onCityChange(e.target.value, city?.name || '');
            }}
            disabled={!formData.provinceCode || loading.cities}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading.cities ? 'Loading cities...' : 'Select City / Municipality'}
            </option>
            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Baranggay <span className="text-gray-400">( Optional )</span>
          </label>
          <select
            name="baranggay"
            value={formData.baranggay}
            onChange={(e) => onBarangayChange(e.target.value)}
            disabled={!formData.cityMunicipalityCode || loading.barangays}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading.barangays ? 'Loading barangays...' : 'Select Baranggay'}
            </option>
            {barangays.map((barangay) => (
              <option key={barangay.code} value={barangay.name}>
                {barangay.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
