import React from 'react';

const LoadingMultiItem = React.memo(
  ({ customClass, number = 15 }: { customClass: string; number?: number }) => {
    const items = [];

    for (let i = 0; i < number; i++) {
      items.push(<div className={customClass} key={i}></div>);
    }
    return <>{items}</>;
  }
);

LoadingMultiItem.displayName = 'LoadingMultiItem';
export default LoadingMultiItem;
