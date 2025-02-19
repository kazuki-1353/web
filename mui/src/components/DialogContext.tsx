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
  MouseEventHandler,
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
type TContext = {
  isOpen: boolean;
  open(
    opt: TMessage & {
      onConfirm?: (cb: MouseEventHandler) => void;
    }
  ): void;
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
  const [message, setMessage] = useState<TMessage>({});
  const [handleConfirm, setConfirm] = useState<MouseEventHandler | null>(null);

  const open = useCallback<TContext['open']>((opt) => {
    const { onConfirm, ...msg } = opt;
    setMessage(msg);
    setConfirm(() => onConfirm);
    setTimeout(() => {
      setOpen(true);
    });
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setMessage({});
      setConfirm(null);
    });
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
            onClick={handleConfirm || undefined}
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
