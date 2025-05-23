import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for a protected API route
  if (request.nextUrl.pathname.startsWith('/api/images/delete')) {
    const adminAuth = request.cookies.get('admin-auth')
    
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
