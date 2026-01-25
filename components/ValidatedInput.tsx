"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationState } from "@/hooks/useFieldValidation";

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  validationState?: ValidationState;
  error?: string;
  required?: boolean;
  helpText?: string;
}

export function ValidatedInput({
  label,
  validationState = "idle",
  error,
  required,
  helpText,
  className,
  id,
  ...props
}: ValidatedInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={inputId}
          className={cn(
            "pr-10",
            validationState === "invalid" && "border-destructive focus-visible:ring-destructive",
            validationState === "valid" && "border-green-500 focus-visible:ring-green-500",
            className
          )}
          {...props}
        />
        {/* バリデーションアイコン */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {validationState === "validating" && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {validationState === "valid" && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {validationState === "invalid" && (
            <X className="h-4 w-4 text-destructive" />
          )}
        </div>
      </div>
      {/* エラーメッセージ */}
      {error && validationState === "invalid" && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {/* ヘルプテキスト */}
      {helpText && !error && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
