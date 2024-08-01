import { FC } from 'react';
import cn from 'classnames';

type Props = {
  className?: string;
  size?: number;
  borderColor?: string;
};

export const Loader: FC<Props> = ({
  className = '',
  size = 16,
  borderColor = 'currentColor',
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderTopColor: borderColor,
        borderRightColor: borderColor,
      }}
      aria-label="loader"
      tabIndex={-1}
      className={cn(
        'animate-spin rounded-full border-2 border-b-transparent border-l-transparent',
        className
      )}
    />
  );
};
