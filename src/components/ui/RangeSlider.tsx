import { formatPrice } from '@/lib/utils/format';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState, useRef } from 'react';

type Props = {
  min: number;
  max: number;
  onChange: (values: { min: number; max: number }) => void;
};

const RangeSlider: React.FC<Props> = ({ min, max, onChange }) => {
  const searchParams = useSearchParams();
  const [minVal, setMinVal] = useState<number>(min);
  const [maxVal, setMaxVal] = useState<number>(max);
  const minValRef = useRef<number>(min);
  const maxValRef = useRef<number>(max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);
  useEffect(() => {
    const minPrice = Number(searchParams.get('minPrice'))
      ? Number(searchParams.get('minPrice'))
      : Number(min);
    const maxPrice = Number(searchParams.get('maxPrice'))
      ? Number(searchParams.get('maxPrice'))
      : Number(max);
    setMinVal(Number(minPrice) ? Number(minPrice) : Number(min));
    setMaxVal(Number(maxPrice) ? Number(maxPrice) : Number(max));
    minValRef.current = minPrice as number;
    maxValRef.current = maxPrice as number;
  }, [searchParams, min, max]);
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className='flex flex-col gap-4 text-sm md:text-base'>
      <div className='w-full'>
        <input
          type='range'
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className='thumb thumb--left'
          style={{ zIndex: minVal > max - 100 ? '5' : 'auto' }}
        />
        <input
          type='range'
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className='thumb thumb--right'
        />

        <div className='w-[240px] relative'>
          <div className='absolute w-full h-1 bg-neutral-200' />
          <div ref={range} className='absolute slider__range bg-red-500 h-1' />
        </div>
      </div>
      <div className='flex items-center gap-2 text-base md:text-lg font-bold'>
        <div className='flex items-center gap-2'>
          <p className='w-auto' title={formatPrice(minVal)}>
            {formatPrice(minVal)}
          </p>
          <span>-</span>
          <p className='w-auto' title={formatPrice(maxVal)}>
            {formatPrice(maxVal)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
