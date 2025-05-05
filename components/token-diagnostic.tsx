"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"

type TokenDiagnosticProps = {
  loading: boolean
  diagnostic: any
  onRefresh: () => void
}

export function TokenDiagnostic({ loading, diagnostic, onRefresh }: TokenDiagnosticProps) {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Alert className="bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
            <AlertTitle>Checking Environment</AlertTitle>
          </div>
          <AlertDescription>Verifying BLOB_READ_WRITE_TOKEN availability and validity...</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!diagnostic) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Diagnostic Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div>Failed to run token diagnostic. Please check your network connection.</div>
            <Button onClick={onRefresh} variant="outline" size="sm" className="self-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!diagnostic.tokenExists) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Environment Variable Missing</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div>
              The BLOB_READ_WRITE_TOKEN environment variable is not available. Please make sure it's correctly set in
              your .env.local file. Current environment: {diagnostic.environment}
            </div>
            <Button onClick={onRefresh} variant="outline" size="sm" className="self-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (diagnostic.tokenInfo?.hadQuotes) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Token Format Issue</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div>
              <strong>Your BLOB_READ_WRITE_TOKEN contains quotes.</strong> Please remove the quotes from your .env.local
              file.
            </div>
            <div className="text-sm bg-gray-100 p-2 rounded">
              <div className="font-mono text-red-500">BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."</div>
              <div className="font-mono text-green-500">BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...</div>
            </div>
            <div className="mt-2">
              <strong>Steps to fix:</strong>
              <ol className="list-decimal pl-5 mt-1">
                <li>Open your .env.local file</li>
                <li>Remove the quotes around the token value</li>
                <li>Save the file</li>
                <li>Restart your development server</li>
              </ol>
            </div>
            <Button onClick={onRefresh} variant="outline" size="sm" className="self-start mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry after fixing
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!diagnostic.verified) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Invalid Token</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div>
              The BLOB_READ_WRITE_TOKEN is available but could not be verified. Please check that it's a valid token
              with the correct permissions.
            </div>
            {diagnostic.error && <div className="text-sm bg-red-100 p-2 rounded">Error: {diagnostic.error}</div>}
            {diagnostic.tokenInfo && (
              <div className="text-sm bg-gray-100 p-2 rounded">
                <div>Token format: {diagnostic.tokenInfo.format}</div>
                <div>Token type: {diagnostic.tokenInfo.type}</div>
                <div>Store ID: {diagnostic.tokenInfo.storeId}</div>
                <div>Token length: {diagnostic.tokenInfo.length} characters</div>
                <div>
                  Token preview: {diagnostic.tokenInfo.firstChars}
                  {diagnostic.tokenInfo.lastChars}
                </div>
              </div>
            )}
            <Button onClick={onRefresh} variant="outline" size="sm" className="self-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
          {diagnostic.blobCount !== undefined && (
            <span className="ml-1">Found {diagnostic.blobCount} existing images.</span>
          )}
          {diagnostic.tokenInfo && (
            <div className="mt-2 text-sm">
              <div>Token format: {diagnostic.tokenInfo.format}</div>
              <div>Token type: {diagnostic.tokenInfo.type}</div>
              <div>Store ID: {diagnostic.tokenInfo.storeId}</div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
