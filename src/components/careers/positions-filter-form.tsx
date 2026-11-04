"use client";

import type { ReactNode } from "react";
import Form from "next/form";

export function PositionsFilterForm({ children }: { children: ReactNode }) {
  return (
    <Form
      action=""
      scroll={false}
      className="rounded-[13px] border border-[#dfe9e6] bg-white/85 p-5 shadow-[0_7px_28px_#153c3010]"
      onChange={(event) => {
        if (event.target instanceof HTMLSelectElement) {
          event.currentTarget.requestSubmit();
        }
      }}
    >
      {children}
    </Form>
  );
}
