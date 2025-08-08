"use client";

import { useState, useEffect } from "react";

interface FormattedDateProps {
  date: Date | string;
}

const FormattedDate = ({ date }: FormattedDateProps) => {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const dateObj = new Date(date);
    const formatted = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setFormattedDate(formatted);
  }, [date]);

  // Return a fallback while hydrating
  if (!formattedDate) {
    const dateObj = new Date(date);
    return <span>{dateObj.getFullYear()}</span>;
  }

  return <span>{formattedDate}</span>;
};

export default FormattedDate;
