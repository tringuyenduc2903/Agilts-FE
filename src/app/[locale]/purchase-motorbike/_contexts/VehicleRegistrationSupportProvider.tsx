'use client';
import {
  license_plate_registration_option,
  registration_options,
} from '@/config/config';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from 'react';
export type Option = {
  name: string;
  value: number;
};
type Context = {
  curRegistrationOptions: Option;
  setCurRegistrationOptions: Dispatch<SetStateAction<Option>>;
  curLicensePlateRegistrationOption: Option;
  setCurLicensePlateRegistrationOption: Dispatch<SetStateAction<Option>>;
};
export const VehicleRegistrationSupportContext = createContext<Context>(
  {} as Context
);
export const VehicleRegistrationSupportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [curRegistrationOptions, setCurRegistrationOptions] = useState<Option>(
    registration_options[0]
  );
  const [
    curLicensePlateRegistrationOption,
    setCurLicensePlateRegistrationOption,
  ] = useState<Option>(license_plate_registration_option[0]);
  return (
    <VehicleRegistrationSupportContext.Provider
      value={{
        curRegistrationOptions,
        setCurRegistrationOptions,
        curLicensePlateRegistrationOption,
        setCurLicensePlateRegistrationOption,
      }}
    >
      {children}
    </VehicleRegistrationSupportContext.Provider>
  );
};
