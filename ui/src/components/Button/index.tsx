import { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import { Loader } from '..';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  isPending?: boolean;
  href?: string;
};

export const Button: FC<Props> = ({
  children,
  variant = 'primary',
  className,
  disabled = false,
  isPending = false,
  href,
  ...restProps
}) => {
  const classNames = cn(
    'transition-colors flex justify-center items-center duration-300 p-2 rounded-md text-lg',
    {
      'bg-blue-500 hover:bg-blue-600 text-white':
        variant === 'primary' && !isPending && !disabled,
      'bg-transparent hover:bg-gray-200 text-black':
        variant === 'accent' && !isPending && !disabled,
      'bg-gray-200 text-blue-500 hover:bg-gray-300':
        variant === 'secondary' && !isPending && !disabled,
      'bg-gray-200 cursor-not-allowed text-blue-500 opacity-50':
        isPending || disabled,
    },
    className
  );

  const content = !isPending ? children : <Loader size={20} className="my-1" />;

  if (href) {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <a href={href} {...restProps} className={classNames}>
        {content}
      </a>
    );
  }

  return (
    <button
      {...restProps}
      disabled={disabled || isPending}
      className={classNames}
    >
      {content}
    </button>
  );
};
