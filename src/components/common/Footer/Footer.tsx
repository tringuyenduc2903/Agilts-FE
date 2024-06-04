import React from 'react';
import {
  FaRegClock,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa6';
function Footer() {
  return (
    <footer className='relative z-10'>
      <section className='bg-neutral-900 py-16 px-4'>
        <div className='container m-auto grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='col-span-1 flex flex-col gap-4'>
            <p className='text-white font-bold text-xl md:text-2xl tracking-[2px] md:tracking-[4px]'>
              ABOUT GRANDPRIX
            </p>
            <p className='text-neutral-400 text-sm md:text-base'>
              If you are looking for the smoothest way to reach the top speed &
              cruise in front of your competitors, you’re in the right place.
              Welcome to GrandPrix.
            </p>
            <div className='flex gap-4'>
              <div>
                <FaRegClock className='text-white text-lg sm:text-xl' />
              </div>
              <div className='text-neutral-400 text-base sm:text-lg'>
                <p>Monday-Friday: 9am to 5pm;</p>
                <p>Satuday: 10am to 2pm</p>
              </div>
            </div>
          </div>
          <div className='col-span-1 flex flex-col gap-4'>
            <p className='text-white font-bold text-xl md:text-2xl tracking-[2px] md:tracking-[4px]'>
              OUR SERVICES
            </p>
            <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
              <li>
                <button className='hover:text-red-600 transition-colors'>
                  Chemical Engineering Projects
                </button>
              </li>
              <li>
                <button className='hover:text-red-600 transition-colors'>
                  Mining Engineering
                </button>
              </li>
              <li>
                <button className='hover:text-red-600 transition-colors'>
                  Construction Engineering
                </button>
              </li>
              <li>
                <button className='hover:text-red-600 transition-colors'>
                  Welding Engineering
                </button>
              </li>
              <li>
                <button className='hover:text-red-600 transition-colors'>
                  Space Program XYZ
                </button>
              </li>
            </ul>
          </div>
          <div className='col-span-1 flex flex-col gap-4'>
            <p className='text-white font-bold text-xl md:text-2xl tracking-[2px] md:tracking-[4px]'>
              OFFICE IN NEW YORK
            </p>
            <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
              <li>
                <div className='flex gap-4'>
                  <div>
                    <FaLocationDot className='text-white text-lg sm:text-xl' />
                  </div>
                  <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
                    <li>
                      <button className='hover:text-red-600 transition-colors'>
                        7398 Colonial Rd, Brooklyn
                      </button>
                    </li>
                    <li>
                      <button className='hover:text-red-600 transition-colors'>
                        242 Wythe Ave #4, Brooklyn
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className='flex gap-4'>
                  <div>
                    <FaPhone className='text-white text-lg sm:text-xl' />
                  </div>
                  <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
                    <li>
                      <button className='hover:text-red-600 transition-colors'>
                        + (123) 124-567-8901
                      </button>
                    </li>
                    <li>
                      <button className='hover:text-red-600 transition-colors'>
                        + (123) 124-567-8901
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className='flex gap-4'>
                  <div>
                    <FaEnvelope className='text-white text-lg sm:text-xl' />
                  </div>
                  <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
                    <li>
                      <button className='hover:text-red-600 transition-colors'>
                        carrier@qodeinteractive.com
                      </button>
                    </li>
                    <li>
                      <button className='hover:text-red-600 transition-colors'>
                        grand@qodeinteractive.com
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className='bg-neutral-950 py-8'>
        <p className='text-neutral-300 text-sm text-center'>
          © 2019 QODE INTERACTIVE, ALL RIGHTS RESERVED
        </p>
      </section>
    </footer>
  );
}

export default Footer;
