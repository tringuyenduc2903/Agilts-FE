import React from 'react';

const LoadingMultiItem = React.memo(
  ({ customClass }: { customClass: string }) => {
    const items = [];

    for (let i = 0; i < 15; i++) {
      items.push(<div className={customClass} key={i}></div>);
    }
    return <>{items}</>;
  }
);

LoadingMultiItem.displayName = 'LoadingMultiItem';
export default LoadingMultiItem;
