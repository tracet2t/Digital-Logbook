import { fallbackORPCErrorStatus, ORPCError, isORPCErrorStatus } from '@orpc/client';

class ValidationError extends Error {
  issues;
  data;
  constructor(options) {
    super(options.message, options);
    this.issues = options.issues;
    this.data = options.data;
  }
}
function mergeErrorMap(errorMap1, errorMap2) {
  return { ...errorMap1, ...errorMap2 };
}
async function validateORPCError(map, error) {
  const { code, status, message, data, cause, defined } = error;
  const config = map?.[error.code];
  if (!config || fallbackORPCErrorStatus(error.code, config.status) !== error.status) {
    return defined ? new ORPCError(code, { defined: false, status, message, data, cause }) : error;
  }
  if (!config.data) {
    return defined ? error : new ORPCError(code, { defined: true, status, message, data, cause });
  }
  const validated = await config.data["~standard"].validate(error.data);
  if (validated.issues) {
    return defined ? new ORPCError(code, { defined: false, status, message, data, cause }) : error;
  }
  return new ORPCError(code, { defined: true, status, message, data: validated.value, cause });
}

class ContractProcedure {
  /**
   * This property holds the defined options for the contract procedure.
   */
  "~orpc";
  constructor(def) {
    if (def.route?.successStatus && isORPCErrorStatus(def.route.successStatus)) {
      throw new Error("[ContractProcedure] Invalid successStatus.");
    }
    if (Object.values(def.errorMap).some((val) => val && val.status && !isORPCErrorStatus(val.status))) {
      throw new Error("[ContractProcedure] Invalid error status code.");
    }
    this["~orpc"] = def;
  }
}
function isContractProcedure(item) {
  if (item instanceof ContractProcedure) {
    return true;
  }
  return (typeof item === "object" || typeof item === "function") && item !== null && "~orpc" in item && typeof item["~orpc"] === "object" && item["~orpc"] !== null && "errorMap" in item["~orpc"] && "route" in item["~orpc"] && "meta" in item["~orpc"];
}

export { ContractProcedure as C, ValidationError as V, isContractProcedure as i, mergeErrorMap as m, validateORPCError as v };
