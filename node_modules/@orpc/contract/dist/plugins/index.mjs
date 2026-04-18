import { ORPCError } from '@orpc/client';
import { get } from '@orpc/shared';
import { i as isContractProcedure, V as ValidationError, v as validateORPCError } from '../shared/contract.D_dZrO__.mjs';

class RequestValidationPluginError extends Error {
}
class RequestValidationPlugin {
  constructor(contract) {
    this.contract = contract;
  }
  init(options) {
    options.interceptors ??= [];
    options.interceptors.push(async ({ next, path, input }) => {
      const procedure = get(this.contract, path);
      if (!isContractProcedure(procedure)) {
        throw new RequestValidationPluginError(`No valid procedure found at path "${path.join(".")}", this may happen when the contract router is not properly configured.`);
      }
      const inputSchema = procedure["~orpc"].inputSchema;
      if (inputSchema) {
        const result = await inputSchema["~standard"].validate(input);
        if (result.issues) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Input validation failed",
            data: {
              issues: result.issues
            },
            cause: new ValidationError({
              message: "Input validation failed",
              issues: result.issues,
              data: input
            })
          });
        }
      }
      return await next();
    });
  }
}

class ResponseValidationPlugin {
  constructor(contract) {
    this.contract = contract;
  }
  /**
   * run before (validate after) retry plugin, because validation failed can't be retried
   * run before (validate after) durable iterator plugin, because we expect durable iterator to validation (if user use it)
   */
  order = 12e5;
  init(options) {
    options.interceptors ??= [];
    options.interceptors.push(async ({ next, path }) => {
      const procedure = get(this.contract, path);
      if (!isContractProcedure(procedure)) {
        throw new Error(`[ResponseValidationPlugin] no valid procedure found at path "${path.join(".")}", this may happen when the contract router is not properly configured.`);
      }
      try {
        const output = await next();
        const outputSchema = procedure["~orpc"].outputSchema;
        if (!outputSchema) {
          return output;
        }
        const result = await outputSchema["~standard"].validate(output);
        if (result.issues) {
          throw new ValidationError({
            message: "Server response output does not match expected schema",
            issues: result.issues,
            data: output
          });
        }
        return result.value;
      } catch (e) {
        if (e instanceof ORPCError) {
          throw await validateORPCError(procedure["~orpc"].errorMap, e);
        }
        throw e;
      }
    });
  }
}

export { RequestValidationPlugin, RequestValidationPluginError, ResponseValidationPlugin };
