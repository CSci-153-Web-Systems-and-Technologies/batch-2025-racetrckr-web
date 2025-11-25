'use client';

import { useState } from 'react';
import AddRaceHeader from '@/components/addrace/AddRaceHeader';
import NameDateFields from '@/components/addrace/NameDateFields';
import AddressFields from '@/components/addrace/AddressFields';
import DistanceFields from '@/components/addrace/DistanceFields';
import FinishTimeFields from '@/components/addrace/FinishTimeFields';
import CoverPhotoField from '@/components/addrace/CoverPhotoField';
import NotesField from '@/components/addrace/NotesField';
import FormActions from '@/components/addrace/FormActions';

export default function AddRacePage() {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    regionCode: '',
    province: '',
    provinceCode: '',
    cityMunicipality: '',
    cityMunicipalityCode: '',
    distance: '',
    date: '',
    baranggay: '',
    customDistance: '',
    hours: '',
    minutes: '',
    seconds: '',
    notes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (code: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      regionCode: code,
      region: name,
      provinceCode: '',
      province: '',
      cityMunicipalityCode: '',
      cityMunicipality: '',
      baranggay: '',
    }));
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

  const handleReset = () => {
    setFormData({
      name: '',
      region: '',
      regionCode: '',
      province: '',
      provinceCode: '',
      cityMunicipality: '',
      cityMunicipalityCode: '',
      distance: '',
      date: '',
      baranggay: '',
      customDistance: '',
      hours: '',
      minutes: '',
      seconds: '',
      notes: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
          <AddRaceHeader />

          <form onSubmit={handleSubmit} className="space-y-6">
            <NameDateFields 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />

            <AddressFields 
              formData={formData}
              onRegionChange={handleRegionChange}
              onProvinceChange={handleProvinceChange}
              onCityChange={handleCityChange}
              onBarangayChange={handleBarangayChange}
            />

            <DistanceFields 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />

            <FinishTimeFields 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />

            <CoverPhotoField />

            <NotesField 
              value={formData.notes} 
              handleInputChange={handleInputChange} 
            />

            <FormActions handleReset={handleReset} />
          </form>
        </div>
      </div>
    </div>
  );
}
