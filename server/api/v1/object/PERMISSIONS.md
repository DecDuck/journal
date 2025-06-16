# Object Permissions

Because Cloudflare's S3 storage is string-based KV, we need to store permissions as a string.

This is the format:

`anonymous:read,USERID:read`

It is comma seperated ACLs, where the ACL is formatted as `USER:PERMISSION`
