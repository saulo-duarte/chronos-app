resource "aws_iam_role" "lambda_role" {
  name = "${var.lambda_function_name}-execution-role"

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

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "go_lambda" {
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda_role.arn
  handler       = "bootstrap"
  runtime       = "provided.al2"
  timeout       = 30
  architectures = ["x86_64"]

  s3_bucket = var.s3_bucket
  s3_key    = var.s3_key

  environment {
    variables = {
      DATABASE_DSN = data.aws_ssm_parameter.db_dsn.value
      JWT_SECRET   = data.aws_ssm_parameter.jwt_secret.value

      GOOGLE_CLIENT_ID     = data.aws_ssm_parameter.google_client_id.value
      GOOGLE_CLIENT_SECRET = data.aws_ssm_parameter.google_client_secret.value
      # Ajustado para o nome que está no seu print
      GOOGLE_REDIRECT_URL = data.aws_ssm_parameter.google_redirect_url.value

      SUPABASE_API_KEY             = data.aws_ssm_parameter.supabase_api_key.value
      SUPABASE_STORAGE_BUCKET_NAME = data.aws_ssm_parameter.supabase_bucket.value
      SUPABASE_STORAGE_BASE_URL    = data.aws_ssm_parameter.supabase_url.value

      # ATENÇÃO: Comentei os campos abaixo porque não existem no seu print. 
      # Se sua Lambda precisar deles, você DEVE criá-los no AWS SSM primeiro.
      # FRONTEND_URL         = data.aws_ssm_parameter.frontend_url.value
      # SUPABASE_API_SECRET  = data.aws_ssm_parameter.supabase_api_secret.value

      API_DOMAIN = "api.chronosapp.site"
      LOCAL_TEST = "false"
      ENV        = "prod"
    }
  }
}

resource "aws_ssm_parameter" "lambda_version" {
  name  = var.parameter_store_key
  type  = "String"
  value = var.s3_key

  lifecycle {
    ignore_changes = [value]
  }
}

data "aws_ssm_parameter" "db_dsn" {
  name = "/chronos-api/DATABASE_DSN"
}

data "aws_ssm_parameter" "jwt_secret" {
  name = "/chronos-api/JWT_SECRET"
}

data "aws_ssm_parameter" "google_client_id" {
  name = "/chronos-api/GOOGLE_CLIENT_ID"
}

data "aws_ssm_parameter" "google_client_secret" {
  name = "/chronos-api/GOOGLE_CLIENT_SECRET"
}

data "aws_ssm_parameter" "google_redirect_url" {
  name = "/chronos-api/GOOGLE_REDIRECT_URL"
}

data "aws_ssm_parameter" "supabase_api_key" {
  name = "/chronos-api/SUPABASE_API_KEY"
}

data "aws_ssm_parameter" "supabase_bucket" {
  name = "/chronos-api/SUPABASE_STORAGE_BUCKET_NAME"
}

data "aws_ssm_parameter" "supabase_url" {
  name = "/chronos-api/SUPABASE_STORAGE_BASE_URL"
}

data "aws_ssm_parameter" "frontend_url" {
  name = "/chronos-api/FRONTEND_URL"
}

data "aws_ssm_parameter" "supabase_api_secret" {
  name = "/chronos-api/SUPABASE_API_SECRET"
}
