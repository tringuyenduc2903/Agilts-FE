'use client';
import { documents } from '@/config/config';
import { ModalContext } from '@/contexts/ModalProvider';
import { PopupContext } from '@/contexts/PopupProvider';
import { useUpdateDocumentMutation } from '@/lib/redux/query/appQuery';
import { formatDate } from '@/lib/utils/format';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa6';
type Form = {
  number: string | number;
  issued_name: string;
  issuance_date: string;
  expiry_date: string;
  default: boolean;
};
function UpdateDocumentModal() {
  const { state, setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [updateDocument, { isSuccess, isLoading, isError, error }] =
    useUpdateDocumentMutation();
  const [openType, setOpenType] = useState(false);
  const [type, setType] = useState<number | null>(null);
  const curType = useMemo(() => {
    const valid = documents.find((d) => d.code === type);
    if (valid) return valid;
    return null;
  }, [type]);
  const errors = useMemo(() => {
    return isError && (error as any)?.data;
  }, [isError, error]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<Form>({
    defaultValues: {
      default: false,
    },
  });
  const watchValue = watch();
  useEffect(() => {
    if (state.visibleUpdateDocumentModal) {
      const issuanceDate = formatDate(
        state.visibleUpdateDocumentModal.issuance_date
      );
      const expiryDate = formatDate(
        state.visibleUpdateDocumentModal.expiry_date
      );
      setType(state.visibleUpdateDocumentModal.type);
      setValue('number', state.visibleUpdateDocumentModal.number);
      setValue('issued_name', state.visibleUpdateDocumentModal.issued_name);
      setValue('issuance_date', issuanceDate);
      setValue('expiry_date', expiryDate);
      setValue('default', state.visibleUpdateDocumentModal.default);
    } else {
      setType(null);
      reset();
    }
  }, [state.visibleUpdateDocumentModal, reset, setValue]);
  const handleSelectedType = useCallback((code: number) => {
    setType(code);
    setOpenType(false);
  }, []);
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await updateDocument({
        id: state.visibleUpdateDocumentModal?.id,
        body: { ...data, type: curType?.code },
      });
    },
    [updateDocument, state.visibleUpdateDocumentModal?.id, curType]
  );
  useEffect(() => {
    if (isSubmitting || isLoading) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, isLoading, setVisiblePopup]);
  useEffect(() => {
    if (isSuccess) {
      setVisibleModal('visibleUpdateDocumentModal');
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Cập nhật hồ sơ thành công!',
        },
      });
      setType(null);
      reset();
    }
    if (isError && error) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (error as any)?.data?.message,
        },
      });
    }
  }, [isSuccess, isError, error, setVisiblePopup, setVisibleModal, reset]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <form
        method='POST'
        className='relative bg-white text-neutral-800 text-sm md:text-base py-8 rounded-sm flex flex-col gap-6 min-h-[40vh] max-h-[80vh] w-full sm:w-3/4 md:w-2/3 xl:w-1/2 overflow-y-auto'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='w-full min-h-[40vh] max-h-[60vh] px-4 pt-8 pb-24 overflow-y-auto flex flex-col gap-6'>
          <div className='flex justify-between gap-4'>
            <h1 className='text-lg md:text-xl font-bold'>Cập nhật hồ sơ</h1>
          </div>
          <div className='relative w-full flex flex-col gap-2'>
            <p>Loại hồ sơ</p>
            <button
              className='text-sm md:text-base w-full border border-neutral-300 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => setOpenType(!openType)}
              disabled={isSubmitting}
            >
              {curType ? curType.name : 'Chọn hồ sơ'}
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-10 border-neutral-300 ${
                openType ? 'h-[120px] border' : 'h-0'
              } transition-[height] duration-150 overflow-hidden`}
            >
              <li className='w-full h-[40px]'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
                  type='button'
                  onClick={() => handleSelectedType(0)}
                  disabled={isSubmitting}
                >
                  Chứng minh nhân dân
                </button>
              </li>
              <li className='w-full h-[40px]'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
                  type='button'
                  onClick={() => handleSelectedType(1)}
                  disabled={isSubmitting}
                >
                  Căn cước công dân
                </button>
              </li>
              <li className='w-full h-[40px]'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
                  type='button'
                  onClick={() => handleSelectedType(2)}
                  disabled={isSubmitting}
                >
                  Hộ chiếu
                </button>
              </li>
            </ul>
            {errors?.errors?.type && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.type[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='number'>Mã hồ sơ</label>
            <input
              {...register('number')}
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='text'
              id='number'
              name='number'
              placeholder={`$Mã hồ sơ...`}
              disabled={isSubmitting}
            />
            {errors?.errors?.number && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.number[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='issued_name'>Nơi cấp hồ sơ</label>
            <input
              {...register('issued_name')}
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='text'
              id='issued_name'
              name='issued_name'
              placeholder={`$Nơi cấp hồ sơ...`}
              disabled={isSubmitting}
            />
            {errors?.errors?.issued_name && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.issued_name[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='issuance_date'>Ngày cấp</label>
            <input
              {...register('issuance_date')}
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='date'
              id='issuance_date'
              name='issuance_date'
              disabled={isSubmitting}
            />
            {errors?.errors?.issuance_date && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.issuance_date[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='expiry_date'>Ngày hết hạn</label>
            <input
              {...register('expiry_date')}
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='date'
              id='expiry_date'
              name='expiry_date'
              disabled={isSubmitting}
            />
            {errors?.errors?.expiry_date && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.expiry_date[0]}
              </p>
            )}
          </div>
          <div className='w-full'>
            <button
              type='button'
              className='text-sm md:text-base w-max flex justify-start items-center gap-2'
              onClick={() => setValue('default', !watchValue?.default)}
              disabled={isSubmitting}
            >
              <span
                className={`relative w-[18px] h-[18px] ${
                  watchValue?.default
                    ? 'bg-red-500'
                    : 'border border-neutral-400'
                } rounded-sm text-white`}
              >
                {watchValue?.default && (
                  <FaCheck className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2' />
                )}
              </span>
              <p>Đặt làm hồ sơ mặc định</p>
            </button>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 w-full h-[64px] px-4 bg-white flex justify-end items-center gap-4 border-t border-neutral-300'>
          <button
            type='button'
            className='px-4 py-2 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors'
            onClick={() => setVisibleModal('visibleUpdateDocumentModal')}
            disabled={isSubmitting}
          >
            Trở lại
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors'
            disabled={isSubmitting}
          >
            Cập nhật
          </button>
        </div>
      </form>
    </section>
  );
}

export default UpdateDocumentModal;
