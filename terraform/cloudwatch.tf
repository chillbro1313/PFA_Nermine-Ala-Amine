# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "ecomback_logs" {
  name              = "/ecomback/app"
  retention_in_days = 7

  tags = {
    Name = "ecomback-logs"
  }
}

# CloudWatch Alarm - CPU too high
resource "aws_cloudwatch_metric_alarm" "cpu_alarm" {
  alarm_name          = "ecomback-cpu-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 120
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "CPU usage exceeded 80%"

  dimensions = {
    InstanceId = aws_instance.ecomback_ec2.id
  }
}