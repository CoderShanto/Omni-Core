import { useEffect, useState } from "react";
import Button from "./Button";

export type Owner = {
  _id: string;
  name: string;
};

export type CompanyData = {
  _id: string;
  name: string;
  industry: string;
  address?: string;
  email: string;
  phone?: string;
  owner?: Owner | string;
};

export type CompanyFormData = {
  name: string;
  industry: string;
  address: string;
  email: string;
  phone: string;
  ownerId: string;
};

type Props = {
  onSubmit: (data: CompanyFormData) => void;
  initialData?: CompanyData | null;
  owners: Owner[];
  isLoading?: boolean;
};