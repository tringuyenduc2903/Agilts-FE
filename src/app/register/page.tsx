'use client';
import React, { useState } from 'react';
import bgLogo from '@/assets/h4-slider-img-1.jpg';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  FaFacebookF,
  FaGoogle,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
type Form = {
  email: string;
  password: string;
  confirmPassword: string;
};
function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();
  const [isShowPwd, setIsShowPwd] = useState(false);
  const [isShowConfirmPwd, setIsShowConfirmPwd] = useState(false);
  const onSubmit: SubmitHandler<Form> = (data) => {
    console.log(data);
  };
  return (
    <main className='fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center font-medium text-sm sm:text-base'>
      <section className='fixed w-full h-full top-0 left-0'>
        <Image
          fetchPriority='high'
          className='w-full h-full object-cover'
          src={bgLogo}
          alt='bg-logo'
        />
      </section>
      <section className='relative z-10 w-full px-4 py-8 md:px-0 md:w-4/5 lg:w-2/3 xl:w-1/2 h-[80vh] rounded-sm grid md:grid-cols-2 overflow-hidden'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='col-span-1 px-8 py-4 sm:p-8 bg-neutral-50 flex flex-col justify-center items-center gap-4'
        >
          <h1 className='font-bold text-2xl md:text-4xl uppercase tracking-[4px] md:tracking-[8px]'>
            Register
          </h1>
          <div className='w-full flex flex-col gap-2'>
            <input
              className='w-full h-full p-4 border border-neutral-500 rounded-sm text-sm md:text-base'
              type='email'
              placeholder='Email'
              {...register('email', {
                required: 'Email is required!',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Invalid email address!',
                },
              })}
            />
            {errors.email && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className='w-full flex flex-col gap-2'>
            <div className='relative w-full'>
              <input
                className='w-full h-full p-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                type={isShowPwd ? 'text' : 'password'}
                placeholder='Password'
                {...register('password', {
                  required: 'Password is required!',
                })}
              />
              {isShowPwd && (
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='show-pwd-btn'
                  onClick={() => setIsShowPwd(false)}
                >
                  <FaRegEye className='text-xl' />
                </button>
              )}
              {!isShowPwd && (
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='hide-pwd-btn'
                  onClick={() => setIsShowPwd(true)}
                >
                  <FaRegEyeSlash className='text-xl' />
                </button>
              )}
            </div>
            {errors.password && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.password?.message}
              </p>
            )}
          </div>
          <div className='w-full flex flex-col gap-2'>
            <div className='relative w-full'>
              <input
                className='w-full h-full p-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                type={isShowConfirmPwd ? 'text' : 'password'}
                placeholder='Confirm password'
                {...register('confirmPassword', {
                  required: 'Confirm password is required!',
                })}
              />
              {isShowConfirmPwd && (
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='show-pwd-btn'
                  onClick={() => setIsShowConfirmPwd(false)}
                >
                  <FaRegEye className='text-xl' />
                </button>
              )}
              {!isShowConfirmPwd && (
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='hide-pwd-btn'
                  onClick={() => setIsShowConfirmPwd(true)}
                >
                  <FaRegEyeSlash className='text-xl' />
                </button>
              )}
            </div>
            {errors.confirmPassword && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.confirmPassword?.message}
              </p>
            )}
          </div>
          <button
            className='w-full rounded-sm bg-neutral-800 text-white py-4 font-bold tracking-[4px] text-base md:text-lg'
            type='submit'
          >
            Register
          </button>
          <div>
            <div className='flex items-center gap-2'>
              <p>Already have an account?</p>
              <button
                type='button'
                className='font-bold'
                onClick={() => router.push('/login')}
              >
                Sign in
              </button>
            </div>
            <div className='flex md:hidden flex-col gap-2 items-center'>
              <p className='text-base font-bold'>Or</p>
              <div className='flex items-center gap-4'>
                <button className='bg-neutral-800 rounded-full p-2 text-white hover:text-red-500 transition-colors'>
                  <FaGoogle className='text-lg' />
                </button>
                <button className='bg-neutral-800 rounded-full p-2 text-white hover:text-blue-500 transition-colors'>
                  <FaFacebookF className='text-lg' />
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className='hidden col-span-1 bg-neutral-800 text-white md:flex flex-col justify-center items-center gap-8 px-16'>
          <h1 className='uppercase text-6xl font-bold tracking-[4px]'>
            The black & white form
          </h1>
          {/* <div className='flex items-center gap-4'>
            <button className='bg-white rounded-full p-3 text-neutral-800 hover:text-red-500 transition-colors'>
              <FaGoogle className='text-xl' />
            </button>
            <button className='bg-white rounded-full p-3 text-neutral-800 hover:text-blue-500 transition-colors'>
              <FaFacebookF className='text-xl' />
            </button>
          </div> */}
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
