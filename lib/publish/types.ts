export type PublishStepStatus =
  | "complete"
  | "incomplete";

export interface PublishCheck {
  id: string;
  label: string;
  description: string;
  status: PublishStepStatus;
}

export interface PublishValidationResult {
  valid: boolean;
  checks: PublishCheck[];
}