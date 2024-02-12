"use client";
import { motion } from "framer-motion";
import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import Button from "../button";

export type IModalType = {
  open: () => void;
  close: () => void;
};

type Props = {} & PropsWithChildren;
const Modal: ForwardRefRenderFunction<IModalType, Props> = (
  { children },
  ref
) => {
  const [open, setOpen] = useState(false);
  // const modalRef = useRef<HTMLInputElement>(null);

  // const outsideClick = (e: any) => {
  //   if (modalRef?.current && !modalRef?.current?.contains(e.target)) {
  //     setOpen(false);
  //   }
  // };
  const handleCancel = () => {
    setOpen(false);
  };
  const openModal = () => {
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    close() {
      handleCancel();
    },
    open() {
      openModal();
    },
  }));

  return (
    <>
      {open && (
        <>
          <motion.div
            className="text-white fixed top-0 left-0 bg-gray-900 h-screen w-full z-40 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.6, 0.85] }}
            transition={{ duration: 1.5 }}
            onClick={handleCancel}
          />
          <div
            className="absolute top-0 left-0 flex z-50 text-white translate-y-2/4 translate-x-full"
            // ref={modalRef}
            // onClick={outsideClick}
          >
            <motion.div
              className="w-[500px] bg-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 0.6, 0.85, 1] }}
              transition={{
                duration: 1.5,
              }}
            >
              <div className="flex items-end justify-end">
                <Button onClick={handleCancel} className="w-3/12 !p-5 text-sm">
                  Close
                </Button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </>
  );
};

export default forwardRef(Modal);
