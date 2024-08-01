import {
  InputHTMLAttributes,
  useState,
  useCallback,
  ChangeEvent,
  useRef,
  MouseEvent,
  forwardRef,
  MutableRefObject,
  useMemo,
} from 'react';
import { Button } from '..';
import { Trash } from '../../icons';
import mergeRefs from 'merge-refs';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'title'> & {
  label: string;
  type?: 'text' | 'file';
  errorMessage?: string;
  additionalRef?: MutableRefObject<HTMLInputElement | null>;
  onResetValue?: () => void;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ additionalRef = null, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={mergeRefs(ref, additionalRef)}
        type="text"
        className="outline-transparent outline outline-1 border px-3 py-2 rounded-md border-gray-500 focus:outline-blue-400 transition-all"
      />
    );
  }
);

const FileInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      onChange = () => {},
      onResetValue = () => {},
      additionalRef = null,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [filename, setFilename] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const onUpdateFilename = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        setFilename(file?.name ?? null);

        onChange(event);
      },
      [onChange]
    );

    const onResetInput = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        onResetValue();

        if (inputRef?.current && 'value' in inputRef.current) {
          inputRef.current.value = '';

          setFilename(null);
        }
      },
      [onResetValue]
    );

    const currentFileName = useMemo(() => {
      if (additionalRef?.current?.value && filename) {
        return filename;
      }

      if (defaultValue) {
        return (defaultValue as string).split(/[\\/]/).pop();
      }

      return null;
    }, [filename, additionalRef, defaultValue]);

    return (
      <>
        <input
          {...props}
          ref={mergeRefs(inputRef, additionalRef, ref)}
          hidden
          type="file"
          onChange={onUpdateFilename}
          className="outline-transparent outline outline-1 border px-3 py-2 rounded-md border-gray-500 focus:outline-blue-400 transition-all"
        />

        <div className="cursor-pointer transition-colors flex items-center justify-between gap-6 duration-300 px-3 py-2 rounded-md text-lg border border-dashed border-green-500 hover:border-green-600">
          <span className="text-left truncate">
            {currentFileName || 'No file selected'}
          </span>

          {currentFileName && (
            <Button type="button" onClick={onResetInput} variant="accent">
              <Trash />
            </Button>
          )}
        </div>
      </>
    );
  }
);

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, type = 'text', errorMessage } = props;

  return (
    <label className="flex flex-col gap-1">
      <span className="w-fit">{label}</span>
      {type === 'text' ? (
        <TextInput {...props} ref={ref} />
      ) : (
        <FileInput {...props} ref={ref} />
      )}
      {errorMessage && <span className="text-red-600">{errorMessage}</span>}
    </label>
  );
});
