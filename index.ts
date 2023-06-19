import Form, { FormContext } from "./src/components/Form";
import useDecoratedValidation from "./src/hooks/useDecoratedValidation";
import {
  InferredType,
  ValidatorService,
  validators,
  Rule,
  ValidationResult,
} from "typescript-decorator-validation";

export type { ValidationResult };

export {
  Form,
  InferredType,
  ValidatorService,
  validators,
  Rule,
  FormContext,
  useDecoratedValidation,
};
