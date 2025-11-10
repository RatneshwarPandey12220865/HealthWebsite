import React, { useState, useEffect } from 'react';
import API from '../utils/axios';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, appointmentsRes] = await Promise.all([
        API.get('/doctor/profile'),
        API.get('/doctor/appointments')
      ]);
      setProfile(profileRes.data);
      setAppointments(appointmentsRes.data);
      setTimeSlots(profileRes.data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      await API.post('/doctor/profile', formData);
      fetchData();
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const saveTimeSlots = async () => {
    try {
      await API.put('/doctor/slots', { availableSlots: timeSlots });
      alert('Time slots updated successfully!');
    } catch (error) {
      alert('Error updating time slots');
    }
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { day: 'Monday', startTime: '09:00', endTime: '10:00', isAvailable: true }]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index, field, value) => {
    const updated = timeSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    setTimeSlots(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Appointments
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileTab profile={profile} updateProfile={updateProfile} />
            )}
            
            {activeTab === 'schedule' && (
              <ScheduleTab 
                timeSlots={timeSlots}
                addTimeSlot={addTimeSlot}
                removeTimeSlot={removeTimeSlot}
                updateTimeSlot={updateTimeSlot}
                saveTimeSlots={saveTimeSlots}
              />
            )}
            
            {activeTab === 'appointments' && (
              <AppointmentsTab appointments={appointments} fetchData={fetchData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ profile, updateProfile }) => {
  const [formData, setFormData] = useState({
    specialization: profile?.specialization || '',
    experience: profile?.experience || '',
    qualifications: profile?.qualifications || '',
    consultationFee: profile?.consultationFee || '',
    bio: profile?.bio || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });
    updateProfile(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <select
            value={formData.specialization}
            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          >
            <option value="">Select Specialization</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
          <input
            type="number"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Qualifications</label>
          <input
            type="text"
            value={formData.qualifications}
            onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
          <input
            type="number"
            value={formData.consultationFee}
            onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Update Profile
      </button>
    </form>
  );
};

const ScheduleTab = ({ timeSlots, addTimeSlot, removeTimeSlot, updateTimeSlot, saveTimeSlots }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Available Time Slots</h3>
        <button
          onClick={addTimeSlot}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Time Slot
        </button>
      </div>

      <div className="space-y-4">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
            <select
              value={slot.day}
              onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            
            <span>to</span>
            
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            
            <button
              onClick={() => removeTimeSlot(index)}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={saveTimeSlots}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Save Schedule
      </button>
    </div>
  );
};

const AppointmentsTab = ({ appointments, fetchData }) => {
  const updateAppointment = async (id, status) => {
    try {
      await API.put(`/doctor/appointments/${id}`, { status });
      fetchData();
      alert('Appointment updated successfully!');
    } catch (error) {
      alert('Error updating appointment');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((apt) => (
            <tr key={apt._id}>
              <td className="px-6 py-4 whitespace-nowrap">{apt.patientId?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(apt.appointmentDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {apt.timeSlot.startTime} - {apt.timeSlot.endTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {apt.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                {apt.status === 'pending' && (
                  <button
                    onClick={() => updateAppointment(apt._id, 'confirmed')}
                    className="text-green-600 hover:text-green-900"
                  >
                    Confirm
                  </button>
                )}
                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => updateAppointment(apt._id, 'completed')}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorDashboard;