terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# 1. S3 Bucket for Document Storage
resource "aws_s3_bucket" "rag_documents" {
  bucket = "multi-agent-rag-documents-${random_id.bucket_id.hex}"
}

resource "random_id" "bucket_id" {
  byte_length = 4
}

# 2. Managed Vector Database (RDS Postgres with pgvector)
resource "aws_db_instance" "rag_vector_db" {
  allocated_storage    = 20
  db_name              = "rag_db"
  engine               = "postgres"
  engine_version       = "16.1"
  instance_class       = "db.t4g.micro"
  username             = "postgres"
  password             = var.db_password # In prod, use Secrets Manager
  parameter_group_name = "default.postgres16"
  skip_final_snapshot  = true
  publicly_accessible  = false
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
  default     = "changethispassword123!" # Change me!
}

# 3. IAM Role for Lambda to access Bedrock and S3
resource "aws_iam_role" "lambda_exec_role" {
  name = "multi_agent_rag_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "lambda_custom_policy" {
  name = "multi_agent_rag_lambda_policy"
  role = aws_iam_role.lambda_exec_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Effect   = "Allow"
        Resource = "${aws_s3_bucket.rag_documents.arn}/*"
      }
    ]
  })
}

# 4. Lambda Function for the Agent Backend
# In a real setup, this points to an ECR container image due to large dependencies
resource "aws_lambda_function" "rag_backend" {
  function_name = "multi-agent-rag-backend"
  role          = aws_iam_role.lambda_exec_role.arn
  # Using dummy values. A compiled package/zip or image_uri is needed
  filename      = "dummy.zip" 
  handler       = "app.main.handler" # Mangum handler
  runtime       = "python3.11"
  timeout       = 60
  
  environment {
    variables = {
      POSTGRES_URL = "postgresql+psycopg://${aws_db_instance.rag_vector_db.username}:${var.db_password}@${aws_db_instance.rag_vector_db.endpoint}/${aws_db_instance.rag_vector_db.db_name}"
    }
  }
}

# 5. API Gateway to Expose Lambda
resource "aws_apigatewayv2_api" "rag_http_api" {
  name          = "multi-agent-rag-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.rag_http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.rag_backend.invoke_arn
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.rag_http_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.rag_http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api_gw_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rag_backend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.rag_http_api.execution_arn}/*/*"
}
