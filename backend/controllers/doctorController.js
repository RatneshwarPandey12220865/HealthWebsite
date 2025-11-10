const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get doctor profile
// @route   GET /api/doctor/profile
// @access  Private/Doctor
const getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate('userId', 'name email phone');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile
// @route   POST /api/doctor/profile
// @access  Private/Doctor
const updateProfile = async (req, res) => {
  try {
    const { specialization, experience, qualifications, consultationFee, bio } = req.body;
    
    const updateData = {
      specialization,
      experience,
      qualifications,
      consultationFee,
      bio
    };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    res.json({ message: 'Profile updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set available time slots
// @route   PUT /api/doctor/slots
// @access  Private/Doctor
const setAvailableSlots = async (req, res) => {
  try {
    const { availableSlots } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      { availableSlots },
      { new: true }
    );

    res.json({ message: 'Available slots updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
const getAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email phone')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/doctor/appointments/:id
// @access  Private/Doctor
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, diagnosis, prescription, notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, diagnosis, prescription, notes },
      { new: true }
    ).populate('patientId', 'name email phone');

    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  setAvailableSlots,
  getAppointments,
  updateAppointmentStatus
};