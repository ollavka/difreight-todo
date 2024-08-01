import { FC } from 'react';
import cn from 'classnames';
import { motion } from 'framer-motion';

type Props = {
  isChecked: boolean;
};

export const Checkbox: FC<Props> = ({ isChecked }) => {
  const animationCheckboxVariants = {
    checked: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.2,
      },
    },
    unchecked: {
      pathLength: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div
      className={cn(
        'relative flex h-6 w-6 items-center justify-center rounded-sm transition-colors duration-300 ease-linear',
        'after:absolute after:left-0 after:top-0 after:block after:h-full after:w-full after:rounded-sm after:border-[1px] after:border-green-500 after:transition-colors after:duration-300 after:content-[""]',
        {
          'bg-transparent': !isChecked,
          'bg-green-500': isChecked,
        }
      )}
      role="checkbox"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 23 25"
        strokeWidth="2.5"
        stroke="#fff"
        className="h-5 w-5"
        initial={false}
        animate={isChecked ? 'checked' : 'unchecked'}
      >
        <motion.path
          d="M4.5 12.75l6 6 9-13.5"
          variants={animationCheckboxVariants}
        />
      </motion.svg>
    </div>
  );
};
