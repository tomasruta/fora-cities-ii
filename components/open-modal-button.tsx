"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

interface OpenModalButtonProps extends ButtonProps {
  children: ReactNode;
  text: string;
  className?: string;
}

export default function OpenModalButton({
  children,
  text,
  className = "",
  ...rest
}: OpenModalButtonProps) {
  const modal = useModal();
  return (
    <Button onClick={() => modal?.show(children)} className={cn(className)} {...rest}>
      {text}
    </Button>
  );
}
