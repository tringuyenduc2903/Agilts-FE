'use client';
import React, { useState } from 'react';
import bgImg from '@/assets/p7-title-area-img-1.jpg';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
type Form = {
  email: string;
  name: string;
  message: string;
};
function Contact() {
  const [isFocus, setIsFocus] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = (data) => {
    console.log(data);
  };
  return (
    <main className='w-full pt-[72px] flex flex-col gap-8'>
      <section className='absolute h-[380px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
          fetchPriority='high'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[380px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <p className='text-2xl sm:text-4xl md:text-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
          Liên lạc
        </p>
      </section>
      <section className='bg-white pt-8 pb-16 md:pb-32'>
        <div className='container m-auto px-4 grid grid-col-1'>
          <div className='col-span-1'>
            <form
              className='flex flex-col gap-12'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  className='uppercase text-red-500 font-medium'
                  htmlFor='name'
                >
                  Tên của bạn
                </label>
                <div className='relative py-2'>
                  <input
                    className='w-full h-full font-bold'
                    id='name'
                    type='text'
                    onFocus={() => setIsFocus('name')}
                    {...register('name')}
                  />
                  <span className='absolute bottom-0 left-0 w-full h-[2px] bg-neutral-300'></span>
                  <span
                    className={`absolute bottom-0 left-0 ${
                      isFocus === 'name' ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-200 w-full h-[2px] bg-red-500 z-10`}
                  ></span>
                </div>
                {errors.name && (
                  <p className='py-2 text-red-500 font-bold text-sm md:text-base'>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className='uppercase text-red-500 font-medium'
                  htmlFor='email'
                >
                  Địa chỉ email
                </label>
                <div className='relative py-2'>
                  <input
                    className='w-full h-full font-bold'
                    id='email'
                    type='text'
                    onFocus={() => setIsFocus('email')}
                    {...register('email')}
                  />
                  <span className='absolute bottom-0 left-0 w-full h-[2px] bg-neutral-300'></span>
                  <span
                    className={`absolute bottom-0 left-0 ${
                      isFocus === 'email' ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-200 w-full h-[2px] bg-red-500 z-10`}
                  ></span>
                </div>
                {errors.email && (
                  <p className='py-2 text-red-500 font-bold text-sm md:text-base'>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className='uppercase text-red-500 font-medium'
                  htmlFor='message'
                >
                  Lời nhắn của bạn
                </label>
                <div className='relative py-2'>
                  <textarea
                    className='w-full h-full font-bold'
                    id='message'
                    rows={5}
                    onFocus={() => setIsFocus('message')}
                    {...register('message')}
                  />
                  <span className='absolute bottom-0 left-0 w-full h-[2px] bg-neutral-300'></span>
                  <span
                    className={`absolute bottom-0 left-0 ${
                      isFocus === 'message' ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-200 w-full h-[2px] bg-red-500 z-10`}
                  ></span>
                </div>
                {errors.message && (
                  <p className='py-2 text-red-500 font-bold text-sm md:text-base'>
                    {errors.message.message}
                  </p>
                )}
              </div>
              <button
                className='w-auto lg:w-max px-6 py-4 bg-red-600 text-white font-bold hover:bg-neutral-800 transition-colors uppercase text-sm tracking-[2px] rounded-sm'
                type='submit'
              >
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
