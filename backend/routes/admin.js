const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllDoctors,
  approveDoctor,
  deleteDoctor,
  getAllAppointments,
  getStats,
  getAllPatients,
  deletePatient
} = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.get('/patients', getAllPatients);
router.delete('/patients/:id', deletePatient);
router.get('/appointments', getAllAppointments);
router.get('/stats', getStats);

module.exports = router;