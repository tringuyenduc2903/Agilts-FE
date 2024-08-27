import { UserContext } from '@/contexts/UserProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaAngleLeft, FaXmark } from 'react-icons/fa6';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PopupContext } from '@/contexts/PopupProvider';
import {
  useConfirm2FAMutation,
  useGetRecoveryCodesQuery,
  usePostRecoveryCodesMutation,
  useTurnOf2FAMutation,
  useTurnOn2faMutation,
  useTwoFactorQrCodeQuery,
  useTwoFactorSecretKeyQuery,
} from '@/lib/redux/query/appQuery';
type Props = {
  closeForm: () => void;
};
type Form = {
  code: string;
};
const TwoFactorAuthenticationPopup: React.FC<Props> = ({ closeForm }) => {
  const { user, refetchUser } = useContext(UserContext);
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [curStep, setCurStep] = useState(1);
  const containerRef = useRef<HTMLElement | null>(null);
  const firstStepRef = useRef<HTMLDivElement | null>(null);
  const secondStepRef = useRef<HTMLDivElement | null>(null);
  const thirdStepRef = useRef<HTMLDivElement | null>(null);
  const fourthStepRef = useRef<HTMLDivElement | null>(null);
  const [
    confirm2FA,
    {
      isLoading: isLoadingConfirm,
      isSuccess: isSuccessConfirm,
      isError: isErrorConfirm,
      error: errorConfirm,
    },
  ] = useConfirm2FAMutation();
  const errorsConfirm = useMemo(() => {
    return isErrorConfirm && (errorConfirm as any)?.data;
  }, [isErrorConfirm, errorConfirm]);
  const [
    turnOn2FA,
    { isSuccess: isSuccessTurnOn, isLoading: isLoadingTurnOn },
  ] = useTurnOn2faMutation();
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
    postRecoveryCodes,
    {
      isLoading: isLoadingRecoveryCodes,
      isSuccess: isSuccessPostRecoveryCodes,
    },
  ] = usePostRecoveryCodesMutation();
  const {
    data: listCodes,
    isSuccess: isSuccessListCodes,
    isLoading: isLoadingListCodes,
  } = useGetRecoveryCodesQuery(null, { skip: !isSuccessPostRecoveryCodes });
  const [
    turnOf2FA,
    {
      isSuccess: isSuccessDelete,
      isLoading: isLoadingDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useTurnOf2FAMutation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await confirm2FA({ code: Number(data.code) });
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
    if (isSubmitting || isLoadingConfirm) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, isLoadingConfirm, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessTurnOn) {
      setCurStep(2);
    }
  }, [isSuccessTurnOn]);
  useEffect(() => {
    if (isErrQrCode && errorQrCode) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorQrCode as any)?.data?.message,
        },
      });
    }
    if (isErrSecretKey && errorSecretKey) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorSecretKey as any)?.message,
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
    if (isSuccessConfirm) {
      setCurStep(4);
    }
  }, [isSuccessConfirm]);
  useEffect(() => {
    if (isSuccessDelete) {
      refetchUser();
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Đã gỡ xác thực 2 bước thành công!',
        },
      });
      closeForm();
    }
    if (isErrorDelete && errorDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorDelete as any)?.data?.message,
        },
      });
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    errorDelete,
    setVisiblePopup,
    closeForm,
    refetchUser,
  ]);
  const handleDownload = useCallback(() => {
    if (isSuccessListCodes && listCodes) {
      const element = document.createElement('a');
      const file = new Blob([listCodes.join('\n')], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'recovery_codes.txt';
      document.body.appendChild(element);
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
                ? 'Xác thực 2 yếu tố đang bật'
                : 'Xác thực 2 yếu tố đang tắt'}
            </p>
            <p>
              Bây giờ chúng tôi sẽ yêu cầu mã đăng nhập bất cứ khi nào bạn đăng
              nhập trên thiết bị mà chúng tôi không nhận ra.
            </p>
            {user?.two_factor_confirmed_at && (
              <button
                className='w-max font-bold text-red-500'
                disabled={isLoadingRecoveryCodes || isLoadingListCodes}
                onClick={postRecoveryCodes}
              >
                Tạo danh sách dự phòng mới
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
              !isLoadingListCodes &&
              !isLoadingRecoveryCodes && (
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
                        Sao chép danh sách
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
              )}
            <div className='w-full flex justify-end'>
              {!user?.two_factor_confirmed_at && (
                <button
                  className='w-max font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                  onClick={async () => await turnOn2FA(null)}
                  disabled={isLoadingTurnOn}
                >
                  Bật xác thực
                </button>
              )}
              {user?.two_factor_confirmed_at && (
                <button
                  className='w-max font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                  disabled={isLoadingRecoveryCodes}
                  onClick={() =>
                    setVisibleModal({
                      visibleConfirmModal: {
                        title: `Bạn chắc chắn rằng mình muốn gỡ 2FA?`,
                        description: `Xác thực 2 bước (2FA) là phương pháp bảo mật quản lý truy nhập và danh tính yêu cầu hai hình thức nhận dạng để truy nhập tài nguyên và dữ liệu. 2FA cung cấp cho các doanh nghiệp khả năng giám sát, đồng thời giúp bảo vệ những thông tin và mạng dễ bị tấn công nhất của họ.`,
                        isLoading: isLoadingDelete,
                        cb: async () => await turnOf2FA(null),
                      },
                    })
                  }
                >
                  Tắt xác thực
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
            <h1 className='text-2xl font-bold'>Hướng dẫn thiết lập</h1>
            <div>
              <h2 className='font-bold'>1. Tải ứng dụng xác thực</h2>
              <p>
                Chúng tôi khuyên bạn nên tải xuống Duo Mobile hoặc Google
                Authenticator nếu bạn chưa cài đặt.
              </p>
            </div>
            <div>
              <h2 className='font-bold'>
                2. Quét mã vạch/mã QR này hoặc sao chép khóa
              </h2>
              <p>
                Quét mã vạch/mã QR này trong ứng dụng xác thực hoặc sao chép
                khóa và dán vào ứng dụng xác thực.
              </p>
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
                      Sao chép mã
                    </button>
                  </CopyToClipboard>
                </div>
              )}
            </div>
            <div>
              <h2 className='font-bold'>3. Sao chép và nhập mã 6 chữ số</h2>
              <p>
                Sau khi quét mã vạch/mã QR hoặc nhập khóa, ứng dụng xác thực của
                bạn sẽ tạo mã gồm 6 chữ số. Copy đoạn mã đó rồi quay lại để
                nhập.
              </p>
            </div>
            <button
              type='submit'
              className='font-bold bg-neutral-800 text-white py-3 md:py-4 rounded-sm'
              disabled={isLoadingQrCode || isLoadingSecretKey}
              onClick={() => setCurStep(3)}
            >
              Tiếp tục
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
                disabled={isSubmitting || isLoadingConfirm}
                onClick={() => setCurStep(2)}
              >
                <FaAngleLeft className='text-2xl' />
              </button>
              <button
                aria-label='close'
                disabled={isSubmitting || isLoadingConfirm}
                onClick={closeForm}
              >
                <FaXmark className='text-2xl' />
              </button>
            </div>
            <p className='text-xl md:text-2xl font-bold'>Nhập mã</p>
            <p>Nhập mã gồm 6 chữ số do ứng dụng xác thực tạo</p>
            <form
              className='flex flex-col gap-4'
              onSubmit={handleSubmit(onSubmit)}
              method='POST'
            >
              <div className='relative w-full flex flex-col gap-2'>
                <input
                  disabled={isSubmitting || isLoadingConfirm}
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type='text'
                  placeholder='Mã'
                  {...register('code')}
                />
                {errorsConfirm?.errors?.code && (
                  <p className='text-red-500 font-bold text-sm md:text-base'>
                    {errorsConfirm.errors.code[0]}
                  </p>
                )}
              </div>
              <button
                type='submit'
                className='font-bold bg-neutral-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-sm'
                disabled={isSubmitting || isLoadingConfirm}
              >
                Xác nhận
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
              Danh sách mã khôi phục
            </p>
            <p>
              Bạn có thể dùng mỗi mã khôi phục một lần. Hãy lưu mã khôi phục ở
              nơi an toàn. Nếu không có các mã này thì trong trường hợp không
              thể dùng điện thoại hoặc không thể đăng nhập bằng phương thức bảo
              mật, có khả năng bạn sẽ không đăng nhập được vào tài khoản của
              mình.
            </p>
            <div className='flex items-center gap-4'>
              <button
                className='w-max text-sm font-bold text-blue-700'
                onClick={handleDownload}
              >
                Tải mã xuống
              </button>
              <button
                className='w-max text-sm font-bold text-blue-700'
                onClick={postRecoveryCodes}
              >
                Nhận mã mới
              </button>
            </div>
            {(isLoadingListCodes || isLoadingRecoveryCodes) &&
              curStep === 4 && (
                <div className='relative w-full h-[250px] flex justify-center items-center'>
                  <div className='loader'></div>
                </div>
              )}
            {isSuccessListCodes &&
              !isLoadingListCodes &&
              !isLoadingRecoveryCodes &&
              curStep === 4 && (
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
                        Sao chép danh sách
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
              Hoàn tất
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TwoFactorAuthenticationPopup;
