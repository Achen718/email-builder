# S3 bucket for storing email template images
resource "aws_s3_bucket" "email_assets" {
  bucket = "${var.project_prefix}-email-assets"

  tags = {
    Name        = "Email Template Assets"
    Environment = var.environment
    Project     = "Email Builder"
  }
}

# Set S3 bucket ownership controls
resource "aws_s3_bucket_ownership_controls" "email_assets" {
  bucket = aws_s3_bucket.email_assets.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Configure CORS for direct uploads from browser
resource "aws_s3_bucket_cors_configuration" "email_assets" {
  bucket = aws_s3_bucket.email_assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = var.cors_allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Make bucket objects publicly readable (for image URLs to work)
resource "aws_s3_bucket_public_access_block" "email_assets" {
  bucket = aws_s3_bucket.email_assets.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

