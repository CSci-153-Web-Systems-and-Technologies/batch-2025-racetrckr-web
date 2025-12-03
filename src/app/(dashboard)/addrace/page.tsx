'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase';
import AddRaceHeader from '@/components/addrace/AddRaceHeader';
import NameDateFields from '@/components/addrace/NameDateFields';
import AddressFields from '@/components/addrace/AddressFields';
import DistanceFields from '@/components/addrace/DistanceFields';
import FinishTimeFields from '@/components/addrace/FinishTimeFields';
import CoverPhotoField from '@/components/addrace/CoverPhotoField';
import NotesField from '@/components/addrace/NotesField';
import FormActions from '@/components/addrace/FormActions';

export default function AddRacePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    provinceCode: '',
    cityMunicipality: '',
    cityMunicipalityCode: '',
    distance: '',
    date: '',
    baranggay: '',
    customDistanceValue: '',
    customDistanceUnit: '',
    hours: '',
    minutes: '',
    seconds: '',
    notes: '',
  });

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        toast.error('Please log in to add a race');
        router.push('/login');
        return;
      }
      
      setUserId(user.id);
    }
    
    loadUser();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (code: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      provinceCode: code,
      province: name,
      cityMunicipalityCode: '',
      cityMunicipality: '',
      baranggay: '',
    }));
  };

  const handleCityChange = (code: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      cityMunicipalityCode: code,
      cityMunicipality: name,
      baranggay: '',
    }));
  };

  const handleBarangayChange = (name: string) => {
    setFormData((prev) => ({ ...prev, baranggay: name }));
  };

  const handleDistanceChange = (distance: string) => {
    setFormData((prev) => ({ ...prev, distance }));
  };

  const handleCustomDistanceChange = (value: string, unit: string) => {
    setFormData((prev) => ({
      ...prev,
      customDistanceValue: value,
      customDistanceUnit: unit,
    }));
  };

  // Calculate total distance in km for pace calculator
  const getDistanceInKm = () => {
    if (formData.distance) {
      return parseFloat(formData.distance);
    }
    if (formData.customDistanceValue && formData.customDistanceUnit) {
      const value = parseFloat(formData.customDistanceValue);
      if (formData.customDistanceUnit === 'miles') {
        return value * 1.60934; // Convert miles to km
      }
      return value;
    }
    return 0;
  };

  const handleReset = () => {
    setFormData({
      name: '',
      province: '',
      provinceCode: '',
      cityMunicipality: '',
      cityMunicipalityCode: '',
      distance: '',
      date: '',
      baranggay: '',
      customDistanceValue: '',
      customDistanceUnit: '',
      hours: '',
      minutes: '',
      seconds: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('Please log in to add a race');
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Race name is required');
      return;
    }

    if (!formData.date) {
      toast.error('Race date is required');
      return;
    }

    // Calculate final distance in km
    const distanceInKm = getDistanceInKm();
    if (distanceInKm <= 0) {
      toast.error('Please select or enter a valid distance');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      // Prepare race data
      const raceData = {
        user_id: userId,
        name: formData.name.trim(),
        distance: distanceInKm,
        date: formData.date,
        province: formData.province || null,
        province_code: formData.provinceCode || null,
        city_municipality: formData.cityMunicipality || null,
        city_municipality_code: formData.cityMunicipalityCode || null,
        barangay: formData.baranggay || null,
        hours: formData.hours ? parseInt(formData.hours) : null,
        minutes: formData.minutes ? parseInt(formData.minutes) : null,
        seconds: formData.seconds ? parseInt(formData.seconds) : null,
        notes: formData.notes.trim() || null,
      };

      const { error } = await supabase
        .from('races')
        .insert([raceData]);

      if (error) {
        console.error('Error saving race:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        
        // Show more specific error message
        const errorMessage = error.message || 'Failed to save race. Please try again.';
        toast.error(errorMessage);
        return;
      }

      toast.success('Race added successfully!');
      
      // Redirect to profile after short delay
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#fc4c02]/31 shadow-sm p-8">
          <AddRaceHeader />

          <form onSubmit={handleSubmit} className="space-y-6">
            <NameDateFields 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />

            <AddressFields 
              formData={formData}
              onProvinceChange={handleProvinceChange}
              onCityChange={handleCityChange}
              onBarangayChange={handleBarangayChange}
            />

            <DistanceFields 
              formData={formData}
              onDistanceChange={handleDistanceChange}
              onCustomDistanceChange={handleCustomDistanceChange}
            />

            <FinishTimeFields 
              formData={formData}
              distance={getDistanceInKm()}
              handleInputChange={handleInputChange} 
            />

            <CoverPhotoField />

            <NotesField 
              value={formData.notes} 
              handleInputChange={handleInputChange} 
            />

            <FormActions handleReset={handleReset} isSubmitting={isSubmitting} />
          </form>
        </div>
      </div>
    </div>
  );
}
