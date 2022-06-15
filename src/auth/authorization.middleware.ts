import { Enforcer } from 'casbin';

export class BasicAuthorizer {
  private req: any;
  private enforcer: any;

  constructor(req, enforcer) {
    this.req = req;
    this.enforcer = enforcer;
  }

  getUserRole() {
    const { user } = this.req;
    const { role } = user;
    return role;
  }
  
  checkPermission() {
    const { req, enforcer } = this;
    const { originalUrl: path, method } = req;
    const userRole = this.getUserRole();
    // const enforceOutput = await enforcer.enforce(userRole, path, method);
    const enforceOutput = enforcer.enforceSync(userRole, path, method);
    // const rolesForUser = await enforcer.getRolesForUser('haluk')
    // console.log(rolesForUser);
    
    console.log(`enforcer.enforce(${userRole}, ${path}, ${method}) => `, enforceOutput);
    
    return enforceOutput;
  }
}

// the authorizer middleware
export function authz(newEnforcer: () => Promise<Enforcer>) {
  return async (req, res, next) => {
    const enforcer = await newEnforcer();

    // user sample
    // req.user = { role: 'admin' };

    if (!(enforcer instanceof Enforcer)) {
      res.status(500).json({ 500: 'Invalid enforcer' });
      return;
    }

    const authorizer = new BasicAuthorizer(req, enforcer);
    if (!authorizer.checkPermission()) {
      res.status(403).json({ 403: 'Forbidden' });
      return;
    }

    next();
  };
}
