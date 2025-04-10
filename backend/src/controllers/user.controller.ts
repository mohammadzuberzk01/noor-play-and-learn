
import { Request, Response } from 'express';
import User from '../models/User.model';
import { logger } from '../utils/logger';

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile',
    });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // Ensure user can only update their own profile unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
    }
    
    // Don't allow role updates unless admin
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user profile',
    });
  }
};

// Delete user account
export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    // Ensure user can only delete their own account unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this account',
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (error) {
    logger.error('Delete user account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user account',
    });
  }
};
