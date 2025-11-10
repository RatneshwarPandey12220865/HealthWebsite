const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  setAvailableSlots,
  getAppointments,
  updateAppointmentStatus
} = require('../controllers/doctorController');

// All routes are protected and require doctor role
router.use(protect);
router.use(authorize('doctor'));

router.route('/profile')
  .get(getProfile)
  .post(upload.single('profileImage'), updateProfile);

router.put('/slots', setAvailableSlots);
router.get('/appointments', getAppointments);
router.put('/appointments/:id', updateAppointmentStatus);

module.exports = router;