import { i as isContractProcedure, C as ContractProcedure, m as mergeErrorMap, V as ValidationError } from './shared/contract.D_dZrO__.mjs';
export { v as validateORPCError } from './shared/contract.D_dZrO__.mjs';
import { toHttpPath } from '@orpc/client/standard';
import { toArray, isAsyncIteratorObject, get, isTypescriptObject, isPropertyKey } from '@orpc/shared';
export { AsyncIteratorClass } from '@orpc/shared';
import { mapEventIterator, ORPCError } from '@orpc/client';
export { ORPCError } from '@orpc/client';

function mergeMeta(meta1, meta2) {
  return { ...meta1, ...meta2 };
}

function mergeRoute(a, b) {
  return { ...a, ...b };
}
function prefixRoute(route, prefix) {
  if (!route.path) {
    return route;
  }
  return {
    ...route,
    path: `${prefix}${route.path}`
  };
}
function unshiftTagRoute(route, tags) {
  return {
    ...route,
    tags: [...tags, ...route.tags ?? []]
  };
}
function mergePrefix(a, b) {
  return a ? `${a}${b}` : b;
}
function mergeTags(a, b) {
  return a ? [...a, ...b] : b;
}
function enhanceRoute(route, options) {
  let router = route;
  if (options.prefix) {
    router = prefixRoute(router, options.prefix);
  }
  if (options.tags?.length) {
    router = unshiftTagRoute(router, options.tags);
  }
  return router;
}

function getContractRouter(router, path) {
  let current = router;
  for (let i = 0; i < path.length; i++) {
    const segment = path[i];
    if (!current) {
      return void 0;
    }
    if (isContractProcedure(current)) {
      return void 0;
    }
    if (typeof current !== "object") {
      return void 0;
    }
    current = current[segment];
  }
  return current;
}
function enhanceContractRouter(router, options) {
  if (isContractProcedure(router)) {
    const enhanced2 = new ContractProcedure({
      ...router["~orpc"],
      errorMap: mergeErrorMap(options.errorMap, router["~orpc"].errorMap),
      route: enhanceRoute(router["~orpc"].route, options)
    });
    return enhanced2;
  }
  if (typeof router !== "object" || router === null) {
    return router;
  }
  const enhanced = {};
  for (const key in router) {
    enhanced[key] = enhanceContractRouter(router[key], options);
  }
  return enhanced;
}
function minifyContractRouter(router) {
  if (isContractProcedure(router)) {
    const procedure = {
      "~orpc": {
        errorMap: {},
        meta: router["~orpc"].meta,
        route: router["~orpc"].route
      }
    };
    return procedure;
  }
  if (typeof router !== "object" || router === null) {
    return router;
  }
  const json = {};
  for (const key in router) {
    json[key] = minifyContractRouter(router[key]);
  }
  return json;
}
function populateContractRouterPaths(router, options = {}) {
  const path = toArray(options.path);
  if (isContractProcedure(router)) {
    if (router["~orpc"].route.path === void 0) {
      return new ContractProcedure({
        ...router["~orpc"],
        route: {
          ...router["~orpc"].route,
          path: toHttpPath(path)
        }
      });
    }
    return router;
  }
  if (typeof router !== "object" || router === null) {
    return router;
  }
  const populated = {};
  for (const key in router) {
    populated[key] = populateContractRouterPaths(router[key], { ...options, path: [...path, key] });
  }
  return populated;
}

class ContractBuilder extends ContractProcedure {
  constructor(def) {
    super(def);
    this["~orpc"].prefix = def.prefix;
    this["~orpc"].tags = def.tags;
  }
  /**
   * Sets or overrides the initial meta.
   *
   * @see {@link https://orpc.dev/docs/metadata Metadata Docs}
   */
  $meta(initialMeta) {
    return new ContractBuilder({
      ...this["~orpc"],
      meta: initialMeta
    });
  }
  /**
   * Sets or overrides the initial route.
   * This option is typically relevant when integrating with OpenAPI.
   *
   * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
   * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
   */
  $route(initialRoute) {
    return new ContractBuilder({
      ...this["~orpc"],
      route: initialRoute
    });
  }
  /**
   * Sets or overrides the initial input schema.
   *
   * @see {@link https://orpc.dev/docs/procedure#initial-configuration Initial Procedure Configuration Docs}
   */
  $input(initialInputSchema) {
    return new ContractBuilder({
      ...this["~orpc"],
      inputSchema: initialInputSchema
    });
  }
  /**
   * Adds type-safe custom errors to the contract.
   * The provided errors are spared-merged with any existing errors in the contract.
   *
   * @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
   */
  errors(errors) {
    return new ContractBuilder({
      ...this["~orpc"],
      errorMap: mergeErrorMap(this["~orpc"].errorMap, errors)
    });
  }
  /**
   * Sets or updates the metadata for the contract.
   * The provided metadata is spared-merged with any existing metadata in the contract.
   *
   * @see {@link https://orpc.dev/docs/metadata Metadata Docs}
   */
  meta(meta) {
    return new ContractBuilder({
      ...this["~orpc"],
      meta: mergeMeta(this["~orpc"].meta, meta)
    });
  }
  /**
   * Sets or updates the route definition for the contract.
   * The provided route is spared-merged with any existing route in the contract.
   * This option is typically relevant when integrating with OpenAPI.
   *
   * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
   * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
   */
  route(route) {
    return new ContractBuilder({
      ...this["~orpc"],
      route: mergeRoute(this["~orpc"].route, route)
    });
  }
  /**
   * Defines the input validation schema for the contract.
   *
   * @see {@link https://orpc.dev/docs/procedure#input-output-validation Input Validation Docs}
   */
  input(schema) {
    return new ContractBuilder({
      ...this["~orpc"],
      inputSchema: schema
    });
  }
  /**
   * Defines the output validation schema for the contract.
   *
   * @see {@link https://orpc.dev/docs/procedure#input-output-validation Output Validation Docs}
   */
  output(schema) {
    return new ContractBuilder({
      ...this["~orpc"],
      outputSchema: schema
    });
  }
  /**
   * Prefixes all procedures in the contract router.
   * The provided prefix is post-appended to any existing router prefix.
   *
   * @note This option does not affect procedures that do not define a path in their route definition.
   *
   * @see {@link https://orpc.dev/docs/openapi/routing#route-prefixes OpenAPI Route Prefixes Docs}
   */
  prefix(prefix) {
    return new ContractBuilder({
      ...this["~orpc"],
      prefix: mergePrefix(this["~orpc"].prefix, prefix)
    });
  }
  /**
   * Adds tags to all procedures in the contract router.
   * This helpful when you want to group procedures together in the OpenAPI specification.
   *
   * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
   */
  tag(...tags) {
    return new ContractBuilder({
      ...this["~orpc"],
      tags: mergeTags(this["~orpc"].tags, tags)
    });
  }
  /**
   * Applies all of the previously defined options to the specified contract router.
   *
   * @see {@link https://orpc.dev/docs/router#extending-router Extending Router Docs}
   */
  router(router) {
    return enhanceContractRouter(router, this["~orpc"]);
  }
}
const oc = new ContractBuilder({
  errorMap: {},
  route: {},
  meta: {}
});

const DEFAULT_CONFIG = {
  defaultMethod: "POST",
  defaultSuccessStatus: 200,
  defaultSuccessDescription: "OK",
  defaultInputStructure: "compact",
  defaultOutputStructure: "compact"
};
function fallbackContractConfig(key, value) {
  if (value === void 0) {
    return DEFAULT_CONFIG[key];
  }
  return value;
}

const EVENT_ITERATOR_DETAILS_SYMBOL = Symbol("ORPC_EVENT_ITERATOR_DETAILS");
function eventIterator(yields, returns) {
  return {
    "~standard": {
      [EVENT_ITERATOR_DETAILS_SYMBOL]: { yields, returns },
      vendor: "orpc",
      version: 1,
      validate(iterator) {
        if (!isAsyncIteratorObject(iterator)) {
          return { issues: [{ message: "Expect event iterator", path: [] }] };
        }
        const mapped = mapEventIterator(iterator, {
          async value(value, done) {
            const schema = done ? returns : yields;
            if (!schema) {
              return value;
            }
            const result = await schema["~standard"].validate(value);
            if (result.issues) {
              throw new ORPCError("EVENT_ITERATOR_VALIDATION_FAILED", {
                message: "Event iterator validation failed",
                cause: new ValidationError({
                  issues: result.issues,
                  message: "Event iterator validation failed",
                  data: value
                })
              });
            }
            return result.value;
          },
          error: async (error) => error
        });
        return { value: mapped };
      }
    }
  };
}
function getEventIteratorSchemaDetails(schema) {
  if (schema === void 0) {
    return void 0;
  }
  return schema["~standard"][EVENT_ITERATOR_DETAILS_SYMBOL];
}

function inferRPCMethodFromContractRouter(contract) {
  return (_, path) => {
    const procedure = get(contract, path);
    if (!isContractProcedure(procedure)) {
      throw new Error(
        `[inferRPCMethodFromContractRouter] No valid procedure found at path "${path.join(".")}". This may happen when the contract router is not properly configured.`
      );
    }
    const method = fallbackContractConfig("defaultMethod", procedure["~orpc"].route.method);
    return method === "HEAD" ? "GET" : method;
  };
}

function type(...[map]) {
  return {
    "~standard": {
      vendor: "custom",
      version: 1,
      async validate(value) {
        if (map) {
          return { value: await map(value) };
        }
        return { value };
      }
    }
  };
}

function isSchemaIssue(issue) {
  if (!isTypescriptObject(issue) || typeof issue.message !== "string") {
    return false;
  }
  if (issue.path !== void 0) {
    if (!Array.isArray(issue.path)) {
      return false;
    }
    if (!issue.path.every((segment) => isPropertyKey(segment) || isTypescriptObject(segment) && isPropertyKey(segment.key))) {
      return false;
    }
  }
  return true;
}

export { ContractBuilder, ContractProcedure, ValidationError, enhanceContractRouter, enhanceRoute, eventIterator, fallbackContractConfig, getContractRouter, getEventIteratorSchemaDetails, inferRPCMethodFromContractRouter, isContractProcedure, isSchemaIssue, mergeErrorMap, mergeMeta, mergePrefix, mergeRoute, mergeTags, minifyContractRouter, oc, populateContractRouterPaths, prefixRoute, type, unshiftTagRoute };
