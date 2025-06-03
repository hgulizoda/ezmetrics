import axiosInstance from 'src/utils/axios';

import { IApiResponse } from 'src/types/ApiRes';

import { IFilterProps } from '../types/Filter';
import { IAllPackagesRes } from '../types/AllPackages';
import { IUserProfileRes } from '../types/UserProfileOrders';
import { IGetChinaWarehouseRes } from '../types/ChinaWarehouse';
import { CreatePackageFormType } from '../libs/createPackageScheme';
import { IChinaBorderUpdate, IResiduePackageRes } from '../types/ResiduePackage';

// Create New Package

// Gel all packages for All table
export const allPackages = {
  getAll: (params: IFilterProps) =>
    axiosInstance.get<IApiResponse<IAllPackagesRes>>('orders', { params }).then((res) => res.data),
};

// Get and Update New package Table
export const newPackage = {
  create: (value: CreatePackageFormType) =>
    axiosInstance
      .post('orders', {
        ...value,
        user: value.user.value,
      })
      .then((res) => res),
};

// Get and Update China Warehouse Table
export const chinaWarehouse = {
  getAll: (params: IFilterProps) =>
    axiosInstance
      .get<IApiResponse<IGetChinaWarehouseRes>>('orders?status=in_china_warehouse', { params })
      .then((res) => res.data),
  updateStatus: (id: string, userId: string, data: IChinaBorderUpdate) =>
    axiosInstance.put(`orders/${id}/status/${userId}`, data).then((res) => res),
};

// Get User Profile Orders
export const profileOrders = {
  getAll: (id: string, status: string) =>
    axiosInstance
      .get<{ data: IUserProfileRes[] }>(`orders/user/${id}/orders?status=${status}`)
      .then((res) => res.data),
};

// Get single order

export const singleOrder = {
  get: (id: string) =>
    axiosInstance.get<{ data: IUserProfileRes }>(`orders/${id}`).then((res) => res.data),
  update: (value: CreatePackageFormType, id: string) =>
    axiosInstance
      .put(`orders/${id}`, {
        ...value,
      })
      .then((res) => res),
  goBack: (id: string, userID: string, status: string) =>
    axiosInstance.put(`orders/${id}/status/${userID}`, { status }).then((res) => res),
  archive: (id: string) => axiosInstance.put(`orders/${id}/archive`).then((res) => res),
};

// Add package or packages to truck
export const collectPackage = {
  add: (id: string, truckID: string) =>
    axiosInstance.put(`orders/${id}/truck/${truckID}`).then((res) => res),
};

//
export const witoutTruckPackages = {
  getAll: (params: IFilterProps) =>
    axiosInstance
      .get<IApiResponse<IResiduePackageRes>>('orders/without-truck', { params })
      .then((res) => res.data),
  delivered: (id: string, userID: string) =>
    axiosInstance.put(`orders/${id}/status/${userID}`, { status: 'delivered' }).then((res) => res),
};
