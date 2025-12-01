'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NameDateFields from '@/components/addrace/NameDateFields';
import AddressFields from '@/components/addrace/AddressFields';
import CoverPhotoField from '@/components/addrace/CoverPhotoField';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEventModal = ({ isOpen, onClose }: AddEventModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    province: '',
    provinceCode: '',
    cityMunicipality: '',
    cityMunicipalityCode: '',
    baranggay: ''
  });
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [registrationLink, setRegistrationLink] = useState('');
  const [description, setDescription] = useState('');

  const distances = [
    'Marathon',
    'Half Marathon',
    'Ultra Marathon',
    '15km',
    '10km',
    '5km',
    '3km'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (code: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      province: name,
      provinceCode: code,
      cityMunicipality: '',
      cityMunicipalityCode: '',
      baranggay: ''
    }));
  };

  const handleCityChange = (code: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      cityMunicipality: name,
      cityMunicipalityCode: code,
      baranggay: ''
    }));
  };

  const handleBarangayChange = (name: string) => {
    setFormData(prev => ({ ...prev, baranggay: name }));
  };

  const handleDistanceToggle = (distance: string) => {
    setSelectedDistances(prev =>
      prev.includes(distance)
        ? prev.filter(d => d !== distance)
        : [...prev, distance]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle event submission
    console.log({
      ...formData,
      selectedDistances,
      registrationLink,
      description
    });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormData({
      name: '',
      date: '',
      province: '',
      provinceCode: '',
      cityMunicipality: '',
      cityMunicipalityCode: '',
      baranggay: ''
    });
    setSelectedDistances([]);
    setRegistrationLink('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-2xl font-bold">Add Event</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Free Plan Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Free Plan:</span> Submit community events for review. 
              <button type="button" className="ml-1 text-[#fc4c02] hover:underline font-semibold">
                Upgrade to Premium
              </button>
              {' '}for instant publishing and priority listing.
            </p>
          </div>

          {/* Event Name and Date */}
          <NameDateFields
            formData={formData}
            handleInputChange={handleInputChange}
          />

          {/* Address Fields */}
          <AddressFields
            formData={formData}
            onProvinceChange={handleProvinceChange}
            onCityChange={handleCityChange}
            onBarangayChange={handleBarangayChange}
          />

          {/* Available Distances */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Available Distances <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {distances.map((distance) => (
                <label
                  key={distance}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedDistances.includes(distance)
                      ? 'border-[#fc4c02] bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDistances.includes(distance)}
                    onChange={() => handleDistanceToggle(distance)}
                    className="mr-2 h-4 w-4 text-[#fc4c02] focus:ring-[#fc4c02]"
                  />
                  <span className="text-sm font-medium">{distance}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Registration Link */}
          <div>
            <label htmlFor="registrationLink" className="block text-sm font-medium mb-2">
              Registration Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="registrationLink"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              placeholder="https://example.com/register"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02]"
              required
            />
          </div>

          {/* Cover Photo */}
          <CoverPhotoField />

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Event Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about this event..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#fc4c02] hover:bg-[#e64402]"
            >
              Submit Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
