import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import {
  useConfirm2FAMutation,
  useGetRecoveryCodesQuery,
  useTurnOn2FAMutation,
  useTwoFactorQrCodeQuery,
  useTwoFactorSecretKeyQuery,
} from '@/lib/redux/query/userQuery';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleLeft, FaXmark } from 'react-icons/fa6';
import { SubmitHandler, useForm } from 'react-hook-form';
type Props = {
  closePopup: () => void;
};
type Form = {
  code: string;
};
const TwoFactorAuthenticationPopup: React.FC<Props> = ({ closePopup }) => {
  const { user } = useContext(FetchDataContext);
  const { t } = useTranslation('common');
  const { setVisibleModal } = useContext(ModalContext);
  const [curStep, setCurStep] = useState(1);
  const containerRef = useRef<HTMLElement | null>(null);
  const fistStepRef = useRef<HTMLDivElement | null>(null);
  const secondStepRef = useRef<HTMLDivElement | null>(null);
  const thirdStepRef = useRef<HTMLDivElement | null>(null);
  const fourthStepRef = useRef<HTMLDivElement | null>(null);
  const [
    turnOn2FA,
    { isSuccess: isSuccessTurnOn, isLoading: isLoadingTurnOn },
  ] = useTurnOn2FAMutation();
  const {
    data: qrCode,
    isSuccess: isSuccessQrCode,
    isLoading: isLoadingQrCode,
    isError: isErrQrCode,
    error: errorQrCode,
  } = useTwoFactorQrCodeQuery(null, { skip: !isSuccessTurnOn });
  const {
    data: secretKey,
    isSuccess: isSuccessSecretKey,
    isLoading: isLoadingSecretKey,
    isError: isErrSecretKey,
    error: errorSecretKey,
  } = useTwoFactorSecretKeyQuery(null, { skip: !isSuccessTurnOn });
  const [
    confirm2FA,
    {
      isSuccess: isSuccessConfirm,
      isLoading: isLoadingConfirm,
      isError: isErrorConfirm,
      error: errorConfirm,
    },
  ] = useConfirm2FAMutation();
  const {
    data: listCodes,
    isSuccess: isSuccessListCodes,
    isLoading: isLoadingListCodes,
  } = useGetRecoveryCodesQuery(null, { skip: !isSuccessConfirm });
  const errors = useMemo(() => {
    if (isErrorConfirm && errorConfirm) {
      const error = errorConfirm as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorConfirm, errorConfirm]);
  const { register, handleSubmit } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = async (data) => {
    await confirm2FA(data.code);
  };
  useGSAP(
    () => {
      if (fistStepRef.current && curStep === 1) {
        gsap.fromTo(
          fistStepRef.current,
          {
            translateX: 500,
          },
          {
            translateX: 0,
            duration: 0.3,
          }
        );
      }
      if (secondStepRef.current && curStep === 2) {
        gsap.fromTo(
          secondStepRef.current,
          {
            translateX: 500,
          },
          {
            translateX: 0,
            duration: 0.3,
          }
        );
      }
      if (thirdStepRef.current && curStep === 3) {
        gsap.fromTo(
          secondStepRef.current,
          {
            translateX: 500,
          },
          {
            translateX: 0,
            duration: 0.3,
          }
        );
      }
    },
    { dependencies: [curStep], scope: containerRef }
  );
  useEffect(() => {
    if (isSuccessTurnOn) {
      setCurStep(2);
    }
  }, [isSuccessTurnOn]);
  useEffect(() => {
    if (isErrQrCode && errorQrCode) {
      const error = errorQrCode as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
    if (isErrSecretKey && errorSecretKey) {
      const error = errorSecretKey as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isErrQrCode,
    errorQrCode,
    isErrSecretKey,
    errorSecretKey,
    setVisibleModal,
  ]);
  useEffect(() => {
    if (isSuccessConfirm) {
      setCurStep(4);
    }
  }, [isSuccessConfirm]);
  return (
    <section
      ref={containerRef}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className='fixed top-0 left-0 w-full h-full z-[999] py-16 px-4 flex justify-center items-center'
      // aria-disabled={isLoadingChangePassword}
    >
      <div className='max-w-[540px] w-full bg-white rounded-sm overflow-hidden px-4 py-6 flex flex-col gap-6'>
        {curStep === 1 && (
          <div
            ref={curStep === 1 ? fistStepRef : null}
            className='flex flex-col gap-4'
          >
            <div className='w-full flex justify-end'>
              <button
                aria-label='close'
                disabled={isLoadingTurnOn}
                onClick={closePopup}
              >
                <FaXmark className='text-2xl' />
              </button>
            </div>
            <p className='text-xl md:text-2xl font-bold'>
              {user?.two_factor_confirmed_at
                ? t('mess_2fa_on')
                : t('mess_2fa_off')}
            </p>
            <p>{t('mess_alert_2fa')}</p>
            <div className='w-full flex justify-end'>
              {!user?.two_factor_confirmed_at && (
                <button
                  className='w-max font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                  onClick={async () => await turnOn2FA(null)}
                >
                  {t('turn_on')}
                </button>
              )}
              {user?.two_factor_confirmed_at && (
                <button
                  className='w-max font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                  // onClick={async () => await turnOn2FA(null)}
                >
                  {t('turn_off')}
                </button>
              )}
            </div>
          </div>
        )}
        {curStep === 2 && (
          <div ref={secondStepRef} className='flex flex-col gap-4'>
            <div className='w-full flex justify-between'>
              <button
                aria-label='set-step'
                disabled={isLoadingQrCode || isLoadingSecretKey}
                onClick={() => setCurStep(1)}
              >
                <FaAngleLeft className='text-2xl' />
              </button>
              <button
                aria-label='close'
                disabled={isLoadingQrCode || isLoadingSecretKey}
                onClick={closePopup}
              >
                <FaXmark className='text-2xl' />
              </button>
            </div>
            <h1 className='text-2xl font-bold'>{t('title_setup_2fa')}</h1>
            <div>
              <h2 className='font-bold'>{t('thing_1_setup_2fa')}</h2>
              <p>{t('message_1_setup_2fa')}</p>
            </div>
            <div>
              <h2 className='font-bold'>{t('thing_2_setup_2fa')}</h2>
              <p>{t('message_2_setup_2fa')}</p>
            </div>
            <div className='grid grid-cols-2 place-items-center'>
              {isSuccessQrCode && (
                <div
                  className='col-span-1'
                  dangerouslySetInnerHTML={{ __html: qrCode?.svg }}
                ></div>
              )}
              {isSuccessSecretKey && (
                <div className='col-span-1 flex flex-col gap-2 items-center'>
                  <p className='font-bold'>{secretKey?.secretKey}</p>
                  <CopyToClipboard
                    text={secretKey?.secretKey}
                    onCopy={() => console.log('copied')}
                  >
                    <button className='text-red-500 font-bold'>
                      {t('copy_key')}
                    </button>
                  </CopyToClipboard>
                </div>
              )}
            </div>
            <div>
              <h2 className='font-bold'>{t('thing_3_setup_2fa')}</h2>
              <p>{t('message_3_setup_2fa')}</p>
            </div>
            <button
              type='submit'
              className='font-bold bg-neutral-800 text-white py-3 md:py-4 rounded-sm'
              disabled={isLoadingQrCode || isLoadingSecretKey}
              onClick={() => setCurStep(3)}
            >
              {t('next')}
            </button>
          </div>
        )}
        {curStep === 3 && (
          <div
            ref={curStep === 3 ? thirdStepRef : null}
            className='flex flex-col gap-4'
          >
            <div className='w-full flex justify-between'>
              <button
                aria-label='set-step'
                disabled={isLoadingConfirm}
                onClick={() => setCurStep(2)}
              >
                <FaAngleLeft className='text-2xl' />
              </button>
              <button
                aria-label='close'
                disabled={isLoadingConfirm}
                onClick={closePopup}
              >
                <FaXmark className='text-2xl' />
              </button>
            </div>
            <p className='text-xl md:text-2xl font-bold'>{t('enter_key')}</p>
            <p>{t('mess_enter_code')}</p>
            <form
              className='flex flex-col gap-4'
              onSubmit={handleSubmit(onSubmit)}
              method='POST'
            >
              <div className='relative w-full flex flex-col gap-2'>
                <input
                  disabled={isLoadingConfirm}
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type='text'
                  placeholder='Code'
                  {...register('code')}
                />
                {errors?.code && (
                  <p className='text-red-500 font-bold text-sm md:text-base'>
                    {errors.code[0]}
                  </p>
                )}
              </div>
              <button
                type='submit'
                className='font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                disabled={isLoadingConfirm}
              >
                {isLoadingConfirm ? `...${t('loading')}` : t('confirm')}
              </button>
            </form>
          </div>
        )}
        {curStep === 4 && (
          <div
            ref={curStep === 4 ? fourthStepRef : null}
            className='flex flex-col gap-4'
          >
            <div className='w-full flex justify-between'>
              <button
                aria-label='set-step'
                disabled={isLoadingListCodes}
                onClick={() => setCurStep(3)}
              >
                <FaAngleLeft className='text-2xl' />
              </button>
              <button
                aria-label='close'
                disabled={isLoadingListCodes}
                onClick={closePopup}
              >
                <FaXmark className='text-2xl' />
              </button>
            </div>
            <p className='text-xl md:text-2xl font-bold'>
              {t('recovery_title')}
            </p>
            <p>{t('recovery_mess')}</p>
            <div className='border border-neutral-300 rounded-sm p-4'>
              {isSuccessListCodes &&
                listCodes?.map((c: string) => {
                  return <p key={c}>{c}</p>;
                })}
            </div>
            <div className='w-full flex justify-center'>
              <CopyToClipboard
                text={listCodes}
                onCopy={() => console.log('copied')}
              >
                <button
                  className='w-max font-bold'
                  disabled={isLoadingListCodes}
                >
                  {t('copy_list')}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TwoFactorAuthenticationPopup;
