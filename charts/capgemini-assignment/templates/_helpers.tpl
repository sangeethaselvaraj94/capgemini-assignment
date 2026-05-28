{{- define "capgemini-assignment.name" -}}
capgemini-assignment
{{- end -}}

{{- define "capgemini-assignment.fullname" -}}
{{ include "capgemini-assignment.name" . }}
{{- end -}}
