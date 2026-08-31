import User from "../models/User";
import { IUser } from "../interfaces/user.interface";

export const createUserIntoDB = async (
  payload: IUser,
  companyId?: string
) => {
  // Super Admin can create a user without a company.
  // All other users must belong to the authenticated company.
  const userData = {
    ...payload,
    ...(companyId && { companyId }),
  };

  const result = await User.create(userData);

  return result;
};

export const getAllUsersFromDB = async (
  companyId?: string
) => {
  // Super Admin
  if (!companyId) {
    return await User.find();
  }

  // Company user
  return await User.find({
    companyId,
  });
};

export const getSingleUserFromDB = async (
  id: string,
  companyId?: string
) => {
  // Super Admin can access any user.
  if (!companyId) {
    return await User.findById(id);
  }

  // Company user can ONLY access a user
  // belonging to the same company.
  return await User.findOne({
    _id: id,
    companyId,
  });
};

export const updateUserIntoDB = async (
  id: string,
  payload: Partial<{
    name: string;
    email: string;
    role: string;
    status: string;
    jobTitle: string;
    customJobTitle: string;
  }>,
  companyId?: string
) => {
  // Super Admin can update any user.
  if (!companyId) {
    return await User.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Company user can ONLY update a user
  // from the same company.
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: id,
      companyId: companyId,
    },
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedUser;
};

export const deleteUserFromDB = async (
  id: string,
  companyId?: string
) => {
  // Super Admin can delete any user.
  if (!companyId) {
    return await User.findByIdAndDelete(id);
  }

  // Company user can ONLY delete a user
  // from the same company.
  return await User.findOneAndDelete({
    _id: id,
    companyId,
  });
};