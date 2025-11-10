import React, { useState, useEffect } from 'react';
import API from '../utils/axios';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('doctors');
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, appointmentsRes] = await Promise.all([
        API.get('/patient/doctors'),
        API.get('/patient/appointments')
      ]);
      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const cancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await API.put(`/patient/appointments/${appointmentId}/cancel`);
        fetchData();
        alert('Appointment cancelled successfully!');
      } catch (error) {
        alert('Error cancelling appointment');
      }
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Dashboard</h1>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'doctors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Find Doctors
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Appointments
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'doctors' && (
              <DoctorsTab doctors={doctors} bookAppointment={bookAppointment} />
            )}
            
            {activeTab === 'appointments' && (
              <AppointmentsTab appointments={appointments} cancelAppointment={cancelAppointment} />
            )}
          </div>
        </div>

        {showBooking && (
          <BookingModal
            doctor={selectedDoctor}
            onClose={() => setShowBooking(false)}
            onSuccess={() => {
              setShowBooking(false);
              fetchData();
            }}
          />
        )}
      </div>
    </div>
  );
};

const DoctorsTab = ({ doctors, bookAppointment }) => {
  const [filter, setFilter] = useState('');

  const filteredDoctors = doctors.filter(doctor =>
    (doctor.specialization && doctor.specialization.toLowerCase().includes(filter.toLowerCase())) ||
    (doctor.userId && doctor.userId.name && doctor.userId.name.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">{doctor.userId?.name || 'Unknown Doctor'}</h3>
              <p className="text-gray-600">{doctor.specialization || 'General Medicine'}</p>
              <p className="text-sm text-gray-500">{doctor.experience || 0} years experience</p>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm"><strong>Qualifications:</strong> {doctor.qualifications || 'Not specified'}</p>
              <p className="text-sm"><strong>Fee:</strong> ₹{doctor.consultationFee || 0}</p>
              {doctor.bio && <p className="text-sm text-gray-600">{doctor.bio}</p>}
            </div>
            
            <button
              onClick={() => bookAppointment(doctor)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AppointmentsTab = ({ appointments, cancelAppointment }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((apt) => (
            <tr key={apt._id}>
              <td className="px-6 py-4 whitespace-nowrap">{apt.doctorId?.userId?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{apt.doctorId?.specialization}</td>
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
                  apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {apt.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {apt.status === 'pending' && (
                  <button
                    onClick={() => cancelAppointment(apt._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
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

const BookingModal = ({ doctor, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    startTime: '',
    endTime: '',
    symptoms: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/patient/appointments', {
        doctorId: doctor._id,
        appointmentDate: formData.appointmentDate,
        timeSlot: {
          startTime: formData.startTime,
          endTime: formData.endTime
        },
        symptoms: formData.symptoms
      });
      alert('Appointment booked successfully!');
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking appointment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Book Appointment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="mb-4">
          <p><strong>Doctor:</strong> {doctor.userId?.name || 'Unknown Doctor'}</p>
          <p><strong>Specialization:</strong> {doctor.specialization || 'General Medicine'}</p>
          <p><strong>Fee:</strong> ₹{doctor.consultationFee || 0}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Symptoms (Optional)</label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientDashboard;