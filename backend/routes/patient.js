const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllDoctors,
  getDoctorById,
  bookAppointment,
  getMyAppointments,
  cancelAppointment
} = require('../controllers/patientController');

// All routes are protected and require patient role
router.use(protect);
router.use(authorize('patient'));

router.get('/doctors', getAllDoctors);
router.get('/doctors/:id', getDoctorById);
router.post('/appointments', bookAppointment);
router.get('/appointments', getMyAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);

module.exports = router;