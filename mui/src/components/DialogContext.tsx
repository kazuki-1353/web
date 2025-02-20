/* 布局用

  import { DialogProvider } from '@/components/DialogContext.tsx';

  <DialogProvider></DialogProvider>

*/

/* 组件用

  import { useDialog } from '@/components/DialogContext';

  const { open } = useDialog();

  open({
    title: '',
    content: '',
    onConfirm(e) {},
  });

*/

import {
  createContext,
  memo,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type TMessage = {
  title?: ReactNode;
  content?: ReactNode;
  cancelText?: ReactNode;
  cancelColor?: 'primary' | 'secondary';
  confirmText?: ReactNode;
  confirmColor?: 'primary' | 'secondary';
  confirmDisabled?: boolean;
};
type TEvent = {
  onConfirm?(e: MouseEvent<HTMLButtonElement>): void | Promise<void>;
};
type TContext = {
  isOpen: boolean;
  open(opt: TMessage & TEvent): void;
  setOpen(isOpen: boolean): void;
  setMessage(msg: TMessage): void;
};
const DialogContext = createContext<TContext>({
  isOpen: false,
  open() {},
  setOpen() {},
  setMessage() {},
});

export const DialogProvider = memo((props: { children: ReactNode }) => {
  const { children } = props;

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [message, setMessage] = useState<TMessage>({});
  const [handleConfirm, setConfirm] = useState<TEvent['onConfirm'] | null>(
    null
  );

  const open = useCallback<TContext['open']>((opt) => {
    const { onConfirm, ...msg } = opt;
    setOpen(true);
    setMessage(msg);
    setConfirm(() => onConfirm);
  }, []);
  const close = useCallback(() => {
    setLoading(false);
    setOpen(false);
    setMessage({});
    setConfirm(null);
  }, []);

  return (
    <DialogContext.Provider
      value={{
        isOpen,
        open,
        setOpen,
        setMessage,
      }}
    >
      {children}
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{message.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color={message.cancelColor} onClick={close}>
            {message.cancelText ?? 'Disagree'}
          </Button>
          <Button
            disabled={message.confirmDisabled}
            color={message.confirmColor}
            loading={isLoading}
            onClick={(e) => {
              setLoading(true);
              const res = handleConfirm?.(e);
              if (res instanceof Promise) {
                res.then(close);
              } else {
                close();
              }
            }}
          >
            {message.confirmText ?? 'Agree'}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
});

export const useDialog = () => {
  return useContext(DialogContext);
};
