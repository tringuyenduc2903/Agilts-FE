'use client';
import { documents } from '@/config/config';
import { ModalContext } from '@/contexts/ModalProvider';
import { PopupContext } from '@/contexts/PopupProvider';
import { usePostDocumentMutation } from '@/lib/redux/query/userQuery';
import { useTranslations } from 'next-intl';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaCheck } from 'react-icons/fa6';
type Form = {
  number: string | number;
  issued_name: string;
  issuance_date: string;
  expiry_date: string;
  default: boolean;
};
function AddDocumentModal() {
  const t = useTranslations('common');
  const { state, setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [openType, setOpenType] = useState(false);
  const [type, setType] = useState<number | null>(null);
  const curType = useMemo(() => {
    const valid = documents.find((d) => d.code === type);
    if (valid) return valid;
    return null;
  }, [type]);
  const [form, setForm] = useState<Form>({
    number: '',
    issued_name: '',
    issuance_date: '',
    expiry_date: '',
    default: false,
  });
  const [
    postDocument,
    {
      isLoading: isLoadingPost,
      isSuccess: isSuccessPost,
      isError: isErrorPost,
      error: errorPost,
    },
  ] = usePostDocumentMutation();
  const errors = useMemo(() => {
    if (isErrorPost && errorPost) {
      const error = errorPost as any;
      return {
        errors: error?.data?.errors,
        message: error?.data?.message,
      };
    }
    return null;
  }, [isErrorPost, errorPost]);
  useEffect(() => {
    if (!state.visibleAddDocumentModal) {
      setType(null);
      setForm({
        number: '',
        issued_name: '',
        issuance_date: '',
        expiry_date: '',
        default: false,
      });
    }
  }, [state.visibleAddDocumentModal]);
  const handleSelectedType = useCallback((code: number) => {
    setType(code);
    setOpenType(false);
  }, []);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      return { ...prevForm, [name]: value };
    });
  }, []);
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await postDocument({
        ...form,
        type: curType?.code,
      });
    },
    [postDocument, form, curType]
  );
  useEffect(() => {
    if (isLoadingPost) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingPost, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessPost) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: t('mess_add_document'),
        },
      });
    }
    if (isErrorPost && errorPost) {
      const error = errorPost as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [isSuccessPost, isErrorPost, errorPost, setVisiblePopup, t]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <form
        method='POST'
        className='relative bg-white text-neutral-800 text-sm md:text-base rounded-sm min-h-[40vh] max-h-[60vh] max-w-[500px] w-full overflow-hidden'
        onSubmit={handleSubmit}
      >
        <div className='w-full min-h-[40vh] max-h-[60vh] px-4 pt-8 pb-24 overflow-y-auto flex flex-col gap-6'>
          <div className='flex justify-between gap-4'>
            <h1 className='text-lg md:text-xl font-bold'>
              {t('add_document')}
            </h1>
          </div>
          <div className='relative w-full flex flex-col gap-2'>
            <p>{t('document_type')}</p>
            <button
              className='text-sm md:text-base w-full border border-neutral-300 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => setOpenType(!openType)}
              disabled={isLoadingPost}
            >
              {curType ? t(`${curType.name}`) : t('select_document')}
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
                  disabled={isLoadingPost}
                >
                  {t('identity_card')}
                </button>
              </li>
              <li className='w-full h-[40px]'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
                  type='button'
                  onClick={() => handleSelectedType(1)}
                  disabled={isLoadingPost}
                >
                  {t('citizen_identification_card')}
                </button>
              </li>
              <li className='w-full h-[40px]'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
                  type='button'
                  onClick={() => handleSelectedType(2)}
                  disabled={isLoadingPost}
                >
                  {t('passport')}
                </button>
              </li>
            </ul>
            {errors?.errors.type && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.type[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='number'>{t('document_number')}</label>
            <input
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='number'
              id='number'
              name='number'
              value={form.number}
              placeholder={`${t('document_number')}...`}
              onChange={handleChange}
              disabled={isLoadingPost}
            />
            {errors?.errors.number && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.number[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='issued_name'>{t('issued_name')}</label>
            <input
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='text'
              id='issued_name'
              name='issued_name'
              value={form.issued_name}
              placeholder={`${t('issued_name')}...`}
              onChange={handleChange}
              disabled={isLoadingPost}
            />
            {errors?.errors.issued_name && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.issued_name[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='issuance_date'>{t('issuance_date')}</label>
            <input
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='date'
              id='issuance_date'
              name='issuance_date'
              value={form.issuance_date}
              onChange={handleChange}
              disabled={isLoadingPost}
            />
            {errors?.errors.issuance_date && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.issuance_date[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='expiry_date'>{t('expiry_date')}</label>
            <input
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='date'
              id='expiry_date'
              name='expiry_date'
              value={form.expiry_date}
              onChange={handleChange}
              disabled={isLoadingPost}
            />
            {errors?.errors.expiry_date && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.expiry_date[0]}
              </p>
            )}
          </div>
          <div className='w-full'>
            <button
              type='button'
              className='text-sm md:text-base w-max flex justify-start items-center gap-2'
              onClick={() => setForm({ ...form, default: !form.default })}
              disabled={isLoadingPost}
            >
              <span
                className={`relative w-[18px] h-[18px] ${
                  form.default ? 'bg-red-500' : 'border border-neutral-400'
                } rounded-sm text-white`}
              >
                {form.default && (
                  <FaCheck className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2' />
                )}
              </span>
              <p>{t('set_default_document')}</p>
            </button>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 w-full h-[64px] px-4 bg-white flex justify-end items-center gap-4 border-t border-neutral-300'>
          <button
            type='button'
            className='px-4 py-2 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors'
            onClick={() => setVisibleModal('visibleAddDocumentModal')}
            disabled={isLoadingPost}
          >
            {t('return')}
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors'
            disabled={isLoadingPost}
          >
            {t('complete')}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddDocumentModal;
