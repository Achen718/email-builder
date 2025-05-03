output "s3_bucket_name" {
  description = "Name of the S3 bucket for email assets"
  value       = aws_s3_bucket.email_assets.id
}

output "s3_bucket_region" {
  description = "Region of the S3 bucket"
  value       = var.aws_region
}

output "s3_bucket_domain_name" {
  description = "Domain name for the S3 bucket"
  value       = aws_s3_bucket.email_assets.bucket_regional_domain_name
}
