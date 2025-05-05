"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  message: string
  details?: string | null
  onRetry: () => void
  tokenDiagnostic?: any
}

export function ErrorState({ message, details, onRetry, tokenDiagnostic }: ErrorStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="p-3 bg-red-100 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <p className="mt-4 text-lg font-medium text-red-500">{message}</p>

      {details && <p className="mt-2 text-sm text-red-400 max-w-md text-center">{details}</p>}

      <div className="mt-6">
        <Button onClick={onRetry}>Try Again</Button>
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md max-w-md">
        <h3 className="font-medium text-amber-800">Troubleshooting Tips:</h3>
        <ul className="mt-2 text-sm text-amber-700 list-disc pl-5 space-y-1">
          <li>Ensure the BLOB_READ_WRITE_TOKEN is correctly set in your .env.local file</li>
          <li>
            <strong>Make sure the token does NOT have quotes around it</strong>
          </li>
          <li>Make sure the token format is correct: vercel_blob_rw_STOREID_RANDOMSTRING</li>
          <li>Verify that your Vercel Blob store exists and is properly configured</li>
          <li>Try creating a new token in the Vercel dashboard</li>
          <li>Restart your development server after updating the .env.local file</li>
        </ul>

        {tokenDiagnostic && tokenDiagnostic.tokenInfo?.hadQuotes && (
          <div className="mt-4 p-3 bg-red-100 rounded-md">
            <p className="font-medium text-red-800">Token Has Quotes!</p>
            <p className="text-sm text-red-700 mt-1">
              Your token has quotes around it in the .env.local file. Please remove the quotes:
            </p>
            <div className="mt-2 font-mono text-sm">
              <div className="text-red-500">BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."</div>
              <div className="text-green-500">BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...</div>
            </div>
          </div>
        )}

        {tokenDiagnostic && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <h4 className="font-medium text-amber-800">Token Diagnostic:</h4>
            <ul className="mt-2 text-sm text-amber-700">
              <li>Token exists: {tokenDiagnostic.tokenExists ? "Yes" : "No"}</li>
              <li>Token verified: {tokenDiagnostic.verified ? "Yes" : "No"}</li>
              <li>Environment: {tokenDiagnostic.environment}</li>
              {tokenDiagnostic.tokenInfo && (
                <>
                  <li>Token format: {tokenDiagnostic.tokenInfo.format}</li>
                  <li>Token type: {tokenDiagnostic.tokenInfo.type}</li>
                  <li>Store ID: {tokenDiagnostic.tokenInfo.storeId}</li>
                  <li>Token length: {tokenDiagnostic.tokenInfo.length} characters</li>
                  <li>Has quotes: {tokenDiagnostic.tokenInfo.hadQuotes ? "Yes (Problem!)" : "No (Good)"}</li>
                </>
              )}
              {tokenDiagnostic.error && <li className="text-red-500">Error: {tokenDiagnostic.error}</li>}
            </ul>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-amber-200">
          <h4 className="font-medium text-amber-800">How to Get a Valid Token:</h4>
          <ol className="mt-2 text-sm text-amber-700 list-decimal pl-5 space-y-1">
            <li>Go to your Vercel dashboard</li>
            <li>Select your project</li>
            <li>Go to Storage → Blob</li>
            <li>Create a new Blob store if you don't have one</li>
            <li>Click on "Create Token" and select "Read & Write"</li>
            <li>Copy the token and add it to your .env.local file WITHOUT QUOTES</li>
            <li>Restart your development server</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
