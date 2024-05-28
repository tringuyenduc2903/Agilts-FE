'use client';
import React, { useCallback, useState } from 'react';
import bgLogo from '@/assets/h4-slider-img-1.jpg';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  FaFacebookF,
  FaGoogle,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';
type Form = {
  email: string;
  password: string;
};
function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();
  const [isShowPwd, setIsShowPwd] = useState(false);
  const onSubmit: SubmitHandler<Form> = (data) => {
    console.log(data);
  };
  return (
    <main className='fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center font-medium'>
      <section className='fixed w-full h-full top-0 left-0'>
        <Image
          className='w-full h-full object-cover'
          src={bgLogo}
          alt='bg-logo'
        />
      </section>
      <section className='relative z-10 w-1/2 h-[70vh] bg-neutral-50 rounded-sm grid grid-cols-2 overflow-hidden'>
        <div className='col-span-1 bg-neutral-800 text-white flex flex-col justify-center items-center gap-8 px-16'>
          <h1 className='uppercase text-6xl font-bold tracking-[4px]'>
            The black & white form
          </h1>
          <div className='flex items-center gap-4'>
            <button className='bg-white rounded-full p-3 text-neutral-800 hover:text-red-500 transition-colors'>
              <FaGoogle className='text-xl' />
            </button>
            <button className='bg-white rounded-full p-3 text-neutral-800 hover:text-blue-500 transition-colors'>
              <FaFacebookF className='text-xl' />
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='col-span-1 p-8 flex flex-col justify-center items-center gap-4'
        >
          <h1 className='font-bold text-4xl uppercase tracking-[8px]'>Login</h1>
          <div className='w-full flex flex-col gap-2'>
            <input
              className='w-full h-full p-4 border border-neutral-500 rounded-sm'
              type='email'
              placeholder='Email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Invalid email address!',
                },
              })}
            />
            {errors.email && (
              <p className='text-red-500 font-bold'>{errors.email?.message}</p>
            )}
          </div>
          <div className='w-full flex flex-col gap-2'>
            <div className='relative w-full'>
              <input
                className='w-full h-full p-4 border border-neutral-500 rounded-sm'
                type={isShowPwd ? 'text' : 'password'}
                placeholder='password'
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
              <p className='text-red-500 font-bold'>
                {errors.password?.message}
              </p>
            )}
          </div>
          <button
            className='w-full rounded-sm bg-neutral-800 text-white py-4 font-bold tracking-[4px] text-lg'
            type='submit'
          >
            Login
          </button>
          <div className='flex items-center gap-2'>
            <p>Don't have an account?</p>
            <button type='button' className='font-bold'>
              Sign up
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
