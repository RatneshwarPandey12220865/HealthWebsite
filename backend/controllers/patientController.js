const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get all approved doctors
// @route   GET /api/patient/doctors
// @access  Private/Patient
const getAllDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    
    let query = { isApproved: true };
    if (specialization) {
      query.specialization = specialization;
    }

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email')
      .select('-availableSlots');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/patient/doctors/:id
// @access  Private/Patient
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email');

    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book appointment
// @route   POST /api/patient/appointments
// @access  Private/Patient
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, symptoms } = req.body;

    // Check if doctor exists and is approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ message: 'Doctor not found or not approved' });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      'timeSlot.startTime': timeSlot.startTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      appointmentDate,
      timeSlot,
      symptoms,
      consultationFee: doctor.consultationFee || 500
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'specialization consultationFee')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });

    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointment: populatedAppointment 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patient/appointments
// @access  Private/Patient
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name'
        },
        select: 'specialization'
      })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/patient/appointments/:id/cancel
// @access  Private/Patient
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  bookAppointment,
  getMyAppointments,
  cancelAppointment
};