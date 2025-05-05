"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

type TokenStatusProps = {
  status: {
    checked: boolean
    exists: boolean
    verified: boolean
    environment: string
    tokenInfo?: {
      format: string
      type: string
      storeId: string
    }
  }
}

export function TokenStatus({ status }: TokenStatusProps) {
  if (!status.checked) {
    return null
  }

  if (!status.exists) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Environment Variable Missing</AlertTitle>
          <AlertDescription>
            The BLOB_READ_WRITE_TOKEN environment variable is not available. Please make sure it's correctly set in your
            .env.local file. Current environment: {status.environment}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!status.verified) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Invalid Token</AlertTitle>
          <AlertDescription>
            The BLOB_READ_WRITE_TOKEN is available but could not be verified. Please check that it's a valid token with
            the correct permissions.
            {status.tokenInfo && (
              <div className="mt-2">
                <div>Token format: {status.tokenInfo.format}</div>
                <div>Token type: {status.tokenInfo.type}</div>
                <div>Store ID: {status.tokenInfo.storeId}</div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Token Verified</AlertTitle>
        <AlertDescription>
          BLOB_READ_WRITE_TOKEN is valid and working correctly.
          {status.tokenInfo && (
            <div className="mt-2">
              <div>Token format: {status.tokenInfo.format}</div>
              <div>Token type: {status.tokenInfo.type}</div>
              <div>Store ID: {status.tokenInfo.storeId}</div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
