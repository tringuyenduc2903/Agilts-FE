import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  Option,
  VehicleRegistrationSupportContext,
} from '../_contexts/VehicleRegistrationSupportProvider';
import { license_plate_registration_option } from '@/config/config';
type Props = {
  cb: () => void;
};
function LicensePlateRegistrationOptionModal({ cb }: Props) {
  const {
    curLicensePlateRegistrationOption,
    setCurLicensePlateRegistrationOption,
  } = useContext(VehicleRegistrationSupportContext);
  const [defaultValue, setDefaultValue] = useState<Option>(
    () => curLicensePlateRegistrationOption
  );
  const handleChangeValue = useCallback((value: Option) => {
    setDefaultValue(value);
  }, []);
  const handleSave = useCallback(() => {
    setCurLicensePlateRegistrationOption(defaultValue);
    cb();
  }, [defaultValue, cb, setCurLicensePlateRegistrationOption]);
  const renderedOptions = useMemo(() => {
    return license_plate_registration_option?.map((o: Option) => {
      return (
        <li
          className='py-4 border-b border-neutral-300 flex gap-4 cursor-pointer'
          key={o.value}
          onClick={() => handleChangeValue(o)}
        >
          <div>
            <button
              className={`relative size-4 border-2 ${
                defaultValue?.value === o.value
                  ? 'border-red-500'
                  : 'border-neutral-500'
              } rounded-full`}
              aria-label='select-address'
            >
              {o.value === defaultValue?.value && (
                <span className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-2 rounded-full bg-red-500'></span>
              )}
            </button>
          </div>
          <div className='flex flex-col gap-2'>
            <p>{o.name}</p>
          </div>
        </li>
      );
    });
  }, [defaultValue, handleChangeValue]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='relative bg-white text-neutral-800 text-sm md:text-base px-4 py-8 rounded-sm flex flex-col gap-6 min-h-[40vh] max-h-[80vh] w-full sm:w-3/4 md:w-2/3 xl:w-1/2 overflow-y-auto'>
        <div className='w-full min-h-[40vh] max-h-[60vh] px-4 pt-8 pb-24 overflow-y-auto flex flex-col gap-6'>
          <div className='flex justify-between items-center gap-2'>
            <h1 className='text-lg md:text-xl font-bold'>
              Tùy đăng ký biển số
            </h1>
          </div>
          <div className='w-full h-full'>
            <ul>{renderedOptions}</ul>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 w-full h-[64px] px-4 bg-white flex justify-end items-center gap-4 border-t border-neutral-300'>
          <button
            type='button'
            className='px-4 py-2 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors'
            onClick={cb}
          >
            Trở lại
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors'
            onClick={handleSave}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </section>
  );
}

export default LicensePlateRegistrationOptionModal;
