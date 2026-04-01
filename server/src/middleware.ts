import { withAuthMiddleware } from "./middlewares/authMiddleware";
import { chain } from "./middlewares/chain";
import { withRoleBasedRoutingMiddleware } from "./middlewares/routingMiddleware";

export default chain([withAuthMiddleware, withRoleBasedRoutingMiddleware]);

export const config = {
  matcher: ["/((?!login|api/|_next/static|_next/image|favicon.ico|logo).*)"],
};
