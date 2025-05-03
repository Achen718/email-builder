# CloudFront distribution for the S3 bucket
resource "aws_cloudfront_distribution" "email_assets_cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  # Origin configuration - your S3 bucket
  origin {
    domain_name = aws_s3_bucket.email_assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.email_assets.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.email_assets_oai.cloudfront_access_identity_path
    }
  }

  # Default cache behavior
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.email_assets.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400    # 1 day
    max_ttl     = 31536000 # 1 year
  }

  # Geo restrictions - none
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL certificate
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # Tags
  tags = {
    Environment = var.environment
    Project     = "Email Builder"
  }
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "email_assets_oai" {
  comment = "OAI for Email Builder Assets"
}

# Update S3 bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "email_assets" {
  bucket = aws_s3_bucket.email_assets.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipalReadOnly"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.email_assets.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.email_assets_cdn.arn
          }
        }
      }
    ]
  })
}

# Add CloudFront output
output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.email_assets_cdn.domain_name
  description = "CloudFront distribution domain name"
}
