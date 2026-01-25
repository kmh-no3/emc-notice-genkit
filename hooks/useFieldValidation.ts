import { useState, useCallback } from "react";
import { z } from "zod";

export type ValidationState = "idle" | "validating" | "valid" | "invalid";

export interface ValidationResult {
  state: ValidationState;
  error?: string;
}

export function useFieldValidation(schema: z.ZodSchema) {
  const [validationState, setValidationState] = useState<ValidationState>("idle");
  const [error, setError] = useState<string>();

  const validate = useCallback(
    async (value: unknown): Promise<boolean> => {
      if (value === "" || value === null || value === undefined) {
        setValidationState("idle");
        setError(undefined);
        return true;
      }

      setValidationState("validating");

      try {
        await schema.parseAsync(value);
        setValidationState("valid");
        setError(undefined);
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          setValidationState("invalid");
          setError(err.issues[0]?.message || "入力が無効です");
        }
        return false;
      }
    },
    [schema]
  );

  const reset = useCallback(() => {
    setValidationState("idle");
    setError(undefined);
  }, []);

  return {
    validationState,
    error,
    validate,
    reset,
  };
}
