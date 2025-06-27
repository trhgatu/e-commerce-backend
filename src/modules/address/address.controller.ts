import { Request, Response } from 'express';
import * as addressService from './address.service';
import { handleError } from '@common/utils';

const controller = {
  getMyAddresses: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new Error('User ID not found');

      const addresses = await addressService.getUserAddresses(userId);
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Addresses fetched successfully',
        data: addresses,
      });
    } catch (error) {
      handleError(res, error, 'Failed to get addresses', 400);
    }
  },

  createAddress: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new Error('User ID not found');

      const addressData = {
        ...req.body,
        userId,
      };

      const created = await addressService.createAddress(addressData);
      res.status(201).json({
        success: true,
        code: 201,
        message: 'Address created successfully',
        data: created,
      });
    } catch (error) {
      handleError(res, error, 'Failed to create address', 400);
    }
  },
  getAddressById: async (req: Request, res: Response) => {
    try {
      const address = await addressService.getAddressById(req.params.id);

      if (!address) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Address not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Address fetched successfully',
        data: address,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch address', 400);
    }
  },
  updateAddress: async (req: Request, res: Response) => {
    try {
      const address = await addressService.updateAddress(
        req.params.id,
        req.body
      );

      if (!address) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Address not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Address updated successfully',
        data: address,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update address', 400);
    }
  },

  deleteAddress: async (req: Request, res: Response) => {
    try {
      const address = await addressService.deleteAddress(req.params.id);

      if (!address) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Address not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Address deleted successfully',
        data: address,
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete address', 400);
    }
  },

  setDefaultAddress: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const { addressId } = req.body;

      if (!userId || !addressId)
        throw new Error('Missing user ID or address ID');

      const updated = await addressService.setDefaultAddress(userId, addressId);

      if (!updated) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Address not found or failed to set default',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Default address set successfully',
        data: updated,
      });
    } catch (error) {
      handleError(res, error, 'Failed to set default address', 400);
    }
  },
};

export default controller;
