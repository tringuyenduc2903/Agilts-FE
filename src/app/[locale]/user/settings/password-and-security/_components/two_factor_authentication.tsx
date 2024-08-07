import { UserContext } from '@/contexts/UserProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { FaAngleLeft, FaXmark } from 'react-icons/fa6';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PopupContext } from '@/contexts/PopupProvider';
import { useFetch } from '@/lib/hooks/useFetch';
import {
  confirm2FA,
  getRecoveryCodes,
  postRecoveryCodes,
  turnOf2FA,
  turnOn2FA,
  twoFactorQrCode,
  twoFactorSecretKey,
} from '@/api/user';
type Props = {
  closeForm: () => void;
};
type Form = {
  code: string;
};
const TwoFactorAuthenticationPopup: React.FC<Props> = ({ closeForm }) => {
  const { user, refetchUser } = useContext(UserContext);
  const t = useTranslations('common');
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [curStep, setCurStep] = useState(1);
  const containerRef = useRef<HTMLElement | null>(null);
  const firstStepRef = useRef<HTMLDivElement | null>(null);
  const secondStepRef = useRef<HTMLDivElement | null>(null);
  const thirdStepRef = useRef<HTMLDivElement | null>(null);
  const fourthStepRef = useRef<HTMLDivElement | null>(null);
  const [errorsConfirm2FA, setErrorsConfirm2FA] = useState<any>(null);
  const [successConfirm2FA, setSuccessConfirm2FA] = useState<any>(null);
  const {
    fetchData: turnOn2FAMutation,
    isSuccess: isSuccessTurnOn,
    isLoading: isLoadingTurnOn,
  } = useFetch(async () => await turnOn2FA());
  const {
    fetchData: twoFactorQrCodeMutation,
    data: qrCode,
    isSuccess: isSuccessQrCode,
    isLoading: isLoadingQrCode,
    isError: isErrQrCode,
    error: errorQrCode,
  } = useFetch(async () => await twoFactorQrCode());
  const {
    fetchData: twoFactorSecretKeyMutation,
    data: secretKey,
    isSuccess: isSuccessSecretKey,
    isLoading: isLoadingSecretKey,
    isError: isErrSecretKey,
    error: errorSecretKey,
  } = useFetch(async () => await twoFactorSecretKey());
  const {
    fetchData: postRecoveryCodesMutation,
    isLoading: isLoadingRecoveryCodes,
  } = useFetch(async () => await postRecoveryCodes());
  const {
    fetchData: getRecoveryCodesMutation,
    data: listCodes,
    isSuccess: isSuccessListCodes,
    isLoading: isLoadingListCodes,
  } = useFetch(async () => await getRecoveryCodes());
  const {
    fetchData: turnOf2FAMutation,
    isSuccess: isSuccessDelete,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useFetch(async () => await turnOf2FA());
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      const res = await confirm2FA(data.code);
      if (res.type === 'error') {
        setErrorsConfirm2FA(res.data);
        setSuccessConfirm2FA(null);
      }
      if (res.type === 'success') {
        await getRecoveryCodesMutation();
        await refetchUser();
        setSuccessConfirm2FA('success');
        setErrorsConfirm2FA(null);
      }
    },
    [confirm2FA]
  );
  useGSAP(
    () => {
      const animateStep = (stepRef: React.RefObject<HTMLDivElement>) => {
        if (stepRef.current) {
          gsap.fromTo(
            stepRef.current,
            { translateX: 500 },
            { translateX: 0, duration: 0.3 }
          );
        }
      };

      if (curStep === 1) animateStep(firstStepRef);
      if (curStep === 2) animateStep(secondStepRef);
      if (curStep === 3) animateStep(thirdStepRef);
      if (curStep === 4) animateStep(fourthStepRef);
    },
    { dependencies: [curStep], scope: containerRef }
  );
  useEffect(() => {
    if (isSubmitting) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessTurnOn) {
      setCurStep(2);
      Promise.allSettled([
        twoFactorQrCodeMutation(),
        twoFactorSecretKeyMutation(),
      ]);
    }
  }, [isSuccessTurnOn]);
  useEffect(() => {
    if (isErrQrCode && errorQrCode) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorQrCode?.message,
        },
      });
    }
    if (isErrSecretKey && errorSecretKey) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorSecretKey?.message,
        },
      });
    }
  }, [
    isErrQrCode,
    errorQrCode,
    isErrSecretKey,
    errorSecretKey,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (successConfirm2FA) {
      setCurStep(4);
    }
  }, [successConfirm2FA]);
  useEffect(() => {
    if (isSuccessDelete) {
      refetchUser();
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: t('turn_of_2fa'),
        },
      });
      closeForm();
    }
    if (isErrorDelete && errorDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorDelete?.message,
        },
      });
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    errorDelete,
    setVisiblePopup,
    closeForm,
    t,
  ]);
  const handleDownload = useCallback(() => {
    if (isSuccessListCodes && listCodes) {
      const element = document.createElement('a');
      const file = new Blob([listCodes.join('\n')], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'recovery_codes.txt';
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element);
    }
  }, [listCodes, isSuccessListCodes]);
  return (
    <section
      ref={containerRef}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className='fixed top-0 left-0 w-full h-full z-[999] py-16 px-4 flex justify-center items-center'
    >
      <div className='max-w-[540px] w-full max-h-[80vh] bg-white rounded-sm overflow-y-auto px-4 py-6 flex flex-col gap-6'>
        {curStep === 1 && (
          <div
            ref={curStep === 1 ? firstStepRef : null}
            className='flex flex-col gap-4'
          >
            <div className='w-full flex justify-end'>
              <button
                aria-label='close'
                disabled={isLoadingTurnOn || isSubmitting}
                onClick={closeForm}
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
            {user?.two_factor_confirmed_at && (
              <button
                className='w-max font-bold text-red-500'
                disabled={isLoadingRecoveryCodes || isLoadingListCodes}
                onClick={getRecoveryCodesMutation}
              >
                {t('create_new_codes')}
              </button>
            )}
            {user?.two_factor_confirmed_at &&
              (isLoadingListCodes || isLoadingRecoveryCodes) && (
                <div className='relative w-full h-[250px] flex justify-center items-center'>
                  <div className='loader'></div>
                </div>
              )}
            {user?.two_factor_confirmed_at &&
              isSuccessListCodes &&
              !isLoadingListCodes && (
                <div className='flex flex-col gap-2'>
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
            <div className='w-full flex justify-end'>
              {!user?.two_factor_confirmed_at && (
                <button
                  className='w-max font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                  onClick={turnOn2FAMutation}
                  disabled={isLoadingTurnOn}
                >
                  {t('turn_on')}
                </button>
              )}
              {user?.two_factor_confirmed_at && (
                <button
                  className='w-max font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                  disabled={isLoadingRecoveryCodes}
                  onClick={() =>
                    setVisibleModal({
                      visibleConfirmModal: {
                        title: `${t('title_del_2fa')}`,
                        description: `${t('des_del_2fa')}`,
                        isLoading: isLoadingDelete,
                        cb: turnOf2FAMutation,
                      },
                    })
                  }
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
                onClick={closeForm}
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
            <div className='grid grid-cols-1 sm:grid-cols-2 place-items-center gap-4'>
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
                disabled={isSubmitting}
                onClick={() => setCurStep(2)}
              >
                <FaAngleLeft className='text-2xl' />
              </button>
              <button
                aria-label='close'
                disabled={isSubmitting}
                onClick={closeForm}
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
                  disabled={isSubmitting}
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type='text'
                  placeholder={t('code')}
                  {...register('code')}
                />
                {errorsConfirm2FA?.errors.code && (
                  <p className='text-red-500 font-bold text-sm md:text-base'>
                    {errorsConfirm2FA.errors.code[0]}
                  </p>
                )}
              </div>
              <button
                type='submit'
                className='font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                disabled={isSubmitting}
              >
                {t('confirm')}
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
                onClick={closeForm}
              >
                <FaXmark className='text-2xl' />
              </button>
            </div>
            <p className='text-xl md:text-2xl font-bold'>
              {t('recovery_title')}
            </p>
            <p>{t('recovery_mess')}</p>
            <div className='flex items-center gap-4'>
              <button
                className='w-max text-sm font-bold text-blue-700'
                onClick={handleDownload}
              >
                {t('download_recovery')}
              </button>
              <button
                className='w-max text-sm font-bold text-blue-700'
                onClick={postRecoveryCodesMutation}
              >
                {t('refresh_recovery')}
              </button>
            </div>
            {isLoadingListCodes && curStep === 4 && (
              <div className='relative w-full h-[250px] flex justify-center items-center'>
                <div className='loader'></div>
              </div>
            )}
            {isSuccessListCodes && !isLoadingListCodes && curStep === 4 && (
              <div className='flex flex-col gap-2'>
                <div className='border border-neutral-300 rounded-sm p-4'>
                  {listCodes?.map((c: string) => {
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
            <button
              type='submit'
              className='font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
              onClick={closeForm}
              disabled={isLoadingListCodes}
            >
              {t('done')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TwoFactorAuthenticationPopup;
