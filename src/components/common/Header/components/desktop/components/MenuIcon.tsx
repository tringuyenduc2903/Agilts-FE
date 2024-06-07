import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';
type Props = {
  isOpenMenu: boolean;
  closeMenu: () => void;
};
const MenuIcon: React.FC<Props> = React.memo(({ isOpenMenu, closeMenu }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const circlesRef = useRef<(HTMLElement | null)[]>([]);
  useGSAP(
    () => {
      if (circlesRef.current.length > 0 && container.current && isOpenMenu) {
        gsap.fromTo(
          container.current,
          {
            backgroundColor: '#dc2626',
          },
          {
            backgroundColor: '#fff',
            duration: 0.2,
          }
        );
        circlesRef.current.forEach((el, index) => {
          if (el) {
            gsap.fromTo(
              el,
              { backgroundColor: '#fff' },
              { backgroundColor: '#000', delay: index * 0.01 }
            );
          }
        });
      }
      if (circlesRef.current.length > 0 && container.current && !isOpenMenu) {
        gsap.fromTo(
          container.current,
          {
            backgroundColor: '#fff',
          },
          {
            backgroundColor: '#dc2626',
            duration: 0.2,
          }
        );
        circlesRef.current.forEach((el, index) => {
          if (el) {
            gsap.fromTo(
              el,
              { backgroundColor: '#000' },
              { backgroundColor: '#fff', delay: index * 0.01 }
            );
          }
        });
      }
    },
    { dependencies: [isOpenMenu], scope: container }
  );
  const circles = [];
  for (let i = 0; i < 12; i++) {
    circles.push(
      <div
        key={i}
        ref={(el) => {
          circlesRef.current[i] = el;
        }}
        className='relative circles-menu-icon w-1 h-1 col-span-1 rounded-full'
      ></div>
    );
  }
  return (
    <>
      <div className='relative'>
        <div
          ref={container}
          className='circles-menu bg-red-500 p-6 w-full h-full grid grid-cols-4 gap-1'
        >
          {circles}
        </div>
        <div
          className={`absolute right-0 w-[520px] ${
            isOpenMenu ? 'h-[80vh]' : 'h-0'
          } transition-[height] duration-200 bg-white`}
        ></div>
      </div>
    </>
  );
});

export default MenuIcon;
