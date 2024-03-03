import { NextResponse } from "next/server";

export function middleware(request){

    const {origin, pathname} = request.nextUrl
    
    if(!request.url.includes(".") && !["en", "fr"].includes(pathname.substring(1, 3))){  
        request.nextUrl.pathname = "/en" + pathname
        
        return NextResponse.redirect(request.nextUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }