'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NameDateFields from '@/components/addrace/NameDateFields';
import AddressFields from '@/components/addrace/AddressFields';
import CoverPhotoField from '@/components/addrace/CoverPhotoField';
import { createClient } from '@/lib/supabase';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded?: () => void;
}

const AddEventModal = ({ isOpen, onClose, onEventAdded }: AddEventModalProps) => {
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
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [organizer, setOrganizer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handlePhotoChange = (file: File | null) => {
    setCoverPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate event date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(formData.date);
    
    if (eventDate < today) {
      setSubmitError('Event date cannot be in the past. Please select a future date.');
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setSubmitError('You must be logged in to add an event.');
        return;
      }

      let coverImageUrl = 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80';

      // Upload cover photo if provided
      if (coverPhotoFile) {
        const fileExt = coverPhotoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event-covers')
          .upload(filePath, coverPhotoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading cover photo:', uploadError);
          setSubmitError('Failed to upload cover photo. Please try again.');
          return;
        }

        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('event-covers')
          .getPublicUrl(filePath);

        coverImageUrl = urlData.publicUrl;
      }

      // Insert event into database
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.name,
            description: description || null,
            cover_image_url: coverImageUrl,
            event_date: formData.date,
            city_municipality: formData.cityMunicipality,
            province: formData.province,
            baranggay: formData.baranggay || null,
            available_distances: selectedDistances,
            registration_url: registrationLink,
            organizer: organizer || user.email || 'Unknown',
            created_by: user.id,
            is_active: true,
          },
        ])
        .select();

      if (error) {
        console.error('Error adding event:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setSubmitError(`Failed to add event: ${error.message || 'Please try again.'}`);
        return;
      }

      console.log('Event added successfully:', data);
      
      // Reset form and close modal
      handleReset();
      onClose();
      
      // Trigger parent refresh
      if (onEventAdded) {
        onEventAdded();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setSubmitError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
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
    setCoverPhotoFile(null);
    setCoverPhotoPreview(null);
    setOrganizer('');
    setSubmitError(null);
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

          {/* Organizer */}
          <div>
            <label htmlFor="organizer" className="block text-sm font-medium mb-2">
              Organizer Name
            </label>
            <input
              type="text"
              id="organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="Event organizer or company name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02]"
            />
          </div>

          {/* Cover Photo */}
          <CoverPhotoField 
            onPhotoChange={handlePhotoChange}
            preview={coverPhotoPreview}
          />

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

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1"
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#fc4c02] hover:bg-[#e64402]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
