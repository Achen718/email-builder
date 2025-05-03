variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_prefix" {
  description = "Prefix for project resources"
  type        = string
  default     = "email-builder"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "cors_allowed_origins" {
  description = "Origins allowed for CORS"
  type        = list(string)
  default     = ["http://localhost:3000", "https://email-builder-bice-pi.vercel.app"]
}
