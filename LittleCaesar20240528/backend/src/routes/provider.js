import express from 'express';
import providerController from '../controllers/providersController.js';
import upload from '../utils/CloudinaryConfig.js';

const router = express.Router();

router.route('/')
  .get(providerController.getAllProviders)
  .post(upload.single('image'), providerController.insertProvider);

router.route('/:id')
  .put(upload.single('image'), providerController.updateProvider)
  .delete(providerController.deleteProvider);

export default router;