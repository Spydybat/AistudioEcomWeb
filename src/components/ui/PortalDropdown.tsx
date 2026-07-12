import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

interface PortalDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  isMobile?: boolean;
}

export default function PortalDropdown({
  isOpen,
  onClose,
  triggerRef,
  children,
  isMobile = false,
}: PortalDropdownProps) {
  const [coords, setCoords] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Use passive listeners for better performance during scroll
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay-mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-transparent"
              onClick={onClose}
            />
            <motion.div
              key="menu-mobile"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 lg:right-2 mt-2 w-48 bg-white border border-zinc-100 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay-desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-transparent"
            onClick={onClose}
          />
          <motion.div
            key="menu-desktop"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', top: coords.top + 8, right: coords.right }}
            className="z-[110] mt-2 w-48 bg-white border border-zinc-100 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
