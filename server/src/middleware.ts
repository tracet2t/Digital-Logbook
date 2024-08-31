import { chain } from "./middlewares/chain";
import { withAuthMiddleware } from "./middlewares/authMiddleware";
import { withRoleBasedRoutingMiddleware } from "./middlewares/routingMiddleware";

export default chain([withAuthMiddleware, withRoleBasedRoutingMiddleware])

export const config = {                                               
    matcher: [
      '/((?!login|auth/login|_next/static|_next/image|favicon.ico).*)',
    ],
}