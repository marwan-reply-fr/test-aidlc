
variable "default_tags" {
  description = "Default tags to add to all AWS resources"
  default     = {}
  type        = map(string)
}
