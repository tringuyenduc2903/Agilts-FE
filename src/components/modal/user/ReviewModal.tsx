'use client';
import React, {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa6';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { FaXmark } from 'react-icons/fa6';
import { ModalContext } from '@/contexts/ModalProvider';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { PopupContext } from '@/contexts/PopupProvider';
import {
  usePostReviewImageMutation,
  usePostReviewUserMutation,
} from '@/lib/redux/query/storesQuery';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
const ReviewsModal = () => {
  const t = useTranslations('common');
  const { state, setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [images, setImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [
    postImage,
    {
      data: imageData,
      isSuccess: isSuccessImageData,
      isLoading: isLoadingPostImage,
      isError: isErrorPostImage,
      error: errorPostImage,
    },
  ] = usePostReviewImageMutation();
  const [
    postReview,
    {
      isSuccess: isSuccessPostReview,
      isLoading: isLoadingPostReview,
      error: errorPostReview,
      isError: isErrorPostReview,
    },
  ] = usePostReviewUserMutation();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('image', file);
        setPreviewImages((prevImages) => {
          return [...prevImages, file];
        });
      });
      await postImage(formData);
    },
    [postImage, previewImages]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const { sectionRef, clickOutside } = useClickOutside(() =>
    setVisibleModal('visibleReviewModal')
  );
  const [rate, setRate] = useState(5);
  const [message, setMessage] = useState('');
  const version = useMemo(
    () => state.visibleReviewsModal,
    [state.visibleReviewsModal]
  );
  const handleStarClick = (selectedRate: number) => {
    setRate(selectedRate);
  };
  const getRatingText = useMemo(() => {
    switch (rate) {
      case 1:
        return t('poor');
      case 2:
        return t('not_satisfied');
      case 3:
        return t('average');
      case 4:
        return t('satisfied');
      case 5:
        return t('excellent');
      default:
        return '';
    }
  }, [rate, t]);
  const renderedStars = useMemo(() => {
    return [...Array(5)].map((_, index) => {
      return (
        <div
          key={index}
          className='cursor-pointer'
          onClick={() => handleStarClick(index + 1)}
        >
          {rate >= index + 1 ? (
            <FaStar className='text-red-500' />
          ) : (
            <FaRegStar />
          )}
        </div>
      );
    });
  }, [rate]);
  const handleReviews = useCallback(async () => {
    await postReview({
      content: message,
      rate: rate,
      version: version?.id,
      images: images,
    });
  }, [postReview, message, rate, images, version]);
  useEffect(() => {
    if (isSuccessImageData && imageData) {
      setImages((prevImages) => {
        return [...prevImages, imageData?.file_name];
      });
    }
    if (isErrorPostImage && errorPostImage) {
      const error = errorPostImage as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessImageData,
    imageData,
    isErrorPostImage,
    errorPostImage,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isLoadingPostReview) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingPostReview, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessPostReview) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: t('mess_success_review'),
        },
      });
      setVisibleModal('visibleReviewModal');
    }
    if (isErrorPostReview && errorPostReview) {
      const error = errorPostReview as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessPostReview,
    isErrorPostReview,
    errorPostReview,
    setVisiblePopup,
    setVisibleModal,
  ]);
  return (
    <section
      style={{ backgroundColor: 'rgba(51,51,51,0.8)' }}
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center ${
        state.visibleReviewsModal
          ? 'w-full h-full z-[999] py-8'
          : 'w-0 h-0 -z-10'
      }`}
      onClick={() => clickOutside}
      aria-disabled={isLoadingPostReview || isLoadingPostImage}
    >
      <div
        className='bg-white max-h-[70vh] w-11/12 sm:w-3/4 xl:w-1/3 py-6 flex flex-col justify-between gap-4 rounded-sm overflow-y-auto'
        ref={sectionRef as LegacyRef<HTMLDivElement>}
      >
        <div className='px-6 flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <p className='text-xl md:text-2xl font-bold'>
              {t('product_reviews')}
            </p>
            <button
              aria-label='close-modal'
              onClick={() => setVisibleModal('visibleReviewModal')}
              disabled={isLoadingPostImage || isLoadingPostReview}
            >
              <FaXmark className='text-2xl' />
            </button>
          </div>
          <div className='flex gap-2'>
            <div className='text-sm flex flex-col gap-[4px]'>
              <p
                title={version?.sku}
                className='capitalize text-lg font-medium truncate max-w-[250px] sm:max-w-full'
              >
                {version?.sku}
              </p>
            </div>
          </div>
          <div className='flex sm:flex-row items-center gap-4'>
            <p>{t('evaluate')}:</p>
            <div className='flex items-center gap-4'>
              <div className='flex text-lg'>{renderedStars}</div>
              <p className='sm:block hidden text-yellow'>{getRatingText}</p>
            </div>
          </div>
          <div className='relative w-full flex flex-col gap-4'>
            <div
              {...getRootProps()}
              className='border-2 border-dotted border-neutral-300 rounded-lg py-6'
            >
              {isLoadingPostImage && (
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neutral-100 opacity-80 flex justify-center items-center'>
                  <span className='loader'></span>
                </div>
              )}
              <div
                className='w-full h-full p-4 cursor-pointer flex flex-col items-center gap-2'
                role='presentation'
              >
                <IoCloudUploadOutline className='text-2xl md:text-4xl text-red-500' />
                <p className='font-bold text-sm md:text-base text-center'>
                  {t('mess_upload_img')}
                </p>
              </div>
              <input
                {...getInputProps()}
                accept='image/*,.jpeg,.jpg,.png,.webp'
                type='file'
                style={{ display: 'none' }}
                disabled={isLoadingPostImage || isLoadingPostReview}
              />
            </div>
          </div>
          {previewImages.length > 0 && (
            <div className='grid grid-cols-4 gap-4'>
              {previewImages?.map((img, key) => {
                return (
                  <div className='relative w-[96px] h-[96px]' key={img.name}>
                    {img && (
                      <img
                        className='w-full h-full object-cover'
                        src={URL.createObjectURL(img)}
                        alt={img.name}
                      />
                    )}
                    <button
                      type='button'
                      className='absolute top-1 right-1 border border-red-500 text-red-500 rounded-full p-1'
                      aria-label='remove-img'
                      onClick={() => {
                        setPreviewImages(
                          previewImages.filter((_, index) => index !== key)
                        );
                        setImages(images.filter((_, index) => index !== key));
                      }}
                    >
                      <FaXmark />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <textarea
            className={`border ${
              !message ? 'border-red' : 'border-gray'
            } focus:outline-none rounded-[4px] p-4`}
            name='reviews'
            id='reviews'
            placeholder={t('mess_reviews')}
            cols={10}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className='flex justify-end items-center gap-4'>
            <button
              onClick={() => setVisibleModal('visibleReviewsModal')}
              disabled={isLoadingPostImage || isLoadingPostReview}
            >
              {t('return')}
            </button>
            <button
              className='bg-red-500 hover:bg-neutral-800 px-2 py-1 text-white rounded-sm transition-colors'
              onClick={handleReviews}
              disabled={isLoadingPostImage || isLoadingPostReview}
            >
              {t('complete')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsModal;
