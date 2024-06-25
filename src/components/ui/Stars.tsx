'use client';
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Stars = React.memo(({ rate, size }: { rate: number; size: number }) => {
  const fullStars = Math.floor(rate);
  const decimalPart = rate - fullStars;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar
        style={{ fontSize: `${size}px` }}
        key={i}
        className='text-red-500'
      />
    );
  }
  if (decimalPart > 0) {
    stars.push(
      <FaStarHalfAlt
        style={{ fontSize: `${size}px` }}
        key={fullStars}
        className='text-red-500'
      />
    );
  }
  const remainingStars = 5 - Math.ceil(rate);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <FaRegStar
        key={fullStars + i}
        style={{ fontSize: `${size}px` }}
        className='text-red-500'
      />
    );
  }

  return <>{stars}</>;
});

Stars.displayName = 'Stars';
export default Stars;
