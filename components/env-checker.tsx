"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function EnvChecker() {
  const [status, setStatus] = useState<{
    checked: boolean
    exists: boolean
    environment: string
  }>({
    checked: false,
    exists: false,
    environment: "",
  })

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await fetch("/api/token-diagnostic")
        const data = await response.json()

        setStatus({
          checked: true,
          exists: data.tokenExists || false,
          environment: data.environment || "unknown",
        })
      } catch (err) {
        console.error("Error checking token:", err)
      }
    }

    checkToken()
  }, [])

  if (!status.checked) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {status.exists ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Environment Ready</AlertTitle>
          <AlertDescription>BLOB_READ_WRITE_TOKEN is available. Environment: {status.environment}</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Environment Variable Missing</AlertTitle>
          <AlertDescription>
            The BLOB_READ_WRITE_TOKEN environment variable is not available. Please make sure it's correctly set in your
            .env.local file. Current environment: {status.environment}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
