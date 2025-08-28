"use client";

import React, { forwardRef, useCallback } from "react";
import { InputNumber } from "antd";
import type { InputNumberProps } from "antd";

type DigitStringInputProps = Omit<
  InputNumberProps<string>,
  "stringMode" | "formatter" | "parser" | "precision" | "value" | "onChange"
> & {
  /** Nilai sebagai string agar leading zero terjaga */
  value?: string;
  /** onChange ter-sanitasi: hanya digit, undefined jika kosong dan allowEmpty=true */
  onChange?: (value?: string) => void;
  /** Batas panjang digit (default 15, cocok untuk no. HP) */
  maxLength?: number;
  /** Izinkan kosong (mengembalikan undefined) */
  allowEmpty?: boolean;
};

const DigitStringInput = forwardRef<HTMLInputElement, DigitStringInputProps>(
  (
    {
      value,
      onChange,
      maxLength = 15,
      allowEmpty = true,
      onPaste,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const sanitize = useCallback(
      (raw?: string | number | null) => {
        const s = (raw ?? "").toString().replace(/[^\d]/g, "");
        return maxLength ? s.slice(0, maxLength) : s;
      },
      [maxLength]
    );

    return (
      <InputNumber<string>
        {...rest}
        ref={ref as any}
        className={rest.className}
        controls={false}
        stringMode
        inputMode="numeric" // keypad numerik di mobile
        // precision tidak dipakai karena stringMode + hanya digit
        value={value as any}
        formatter={(v) => sanitize(v as any)}
        parser={(v) => sanitize(v as any)}
        onChange={(v) => {
          const s = typeof v === "string" ? sanitize(v) : "";
          const next = s === "" && allowEmpty ? undefined : s;
          onChange?.(next);
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          if (/\D/.test(text)) e.preventDefault(); // tahan paste non-digit
          onPaste?.(e);
        }}
        onKeyDown={(e) => {
          // tahan char non-digit umum di InputNumber
          if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
          onKeyDown?.(e);
        }}
      />
    );
  }
);

DigitStringInput.displayName = "DigitStringInput";
export default DigitStringInput;
