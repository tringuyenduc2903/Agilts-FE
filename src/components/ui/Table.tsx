'use client';
import { useMemo } from 'react';
import CustomPaginationV2 from './CustomPaginationV2';
import { useTranslations } from 'next-intl';
type Props = {
  tHeader: string[];
  renderedData: any;
  totalPage?: number;
  curPage?: number;
};
const Table = ({ tHeader, renderedData, totalPage, curPage }: Props) => {
  const t = useTranslations('common');
  const tdHeader = useMemo(() => {
    return tHeader.map((h, index) => {
      return (
        <td key={index} className='p-4'>
          {h}
        </td>
      );
    });
  }, [tHeader]);
  return (
    <div className='w-full rounded-sm border border-neutral-300 overflow-x-auto overflow-y-auto'>
      {renderedData.length > 0 ? (
        <table className={`w-full h-full whitespace-nowrap`}>
          <thead className='text-xs md:text-sm font-semibold tracking-wide text-left text-neutral-800 uppercase border-b border-neutral-300'>
            <tr className='w-full text-center font-bold uppercase'>
              {tdHeader}
            </tr>
          </thead>
          <tbody>{renderedData}</tbody>
        </table>
      ) : (
        <div className='w-full h-[30vh] flex justify-center items-center'>
          <p className='text-xl md:text-2xl font-bold'>
            {t('mess_no_cur_order')}
          </p>
        </div>
      )}
      {renderedData.length > 0 && curPage && totalPage && totalPage > 1 && (
        <div className='w-full flex justify-end py-2'>
          <CustomPaginationV2 totalPage={Number(totalPage)} />
        </div>
      )}
    </div>
  );
};

export default Table;
