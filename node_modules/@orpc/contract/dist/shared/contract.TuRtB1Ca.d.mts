import { ORPCErrorCode, ORPCError, HTTPMethod, HTTPPath } from '@orpc/client';
import { Promisable, IsEqual, ThrowableError } from '@orpc/shared';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { OpenAPIV3_1 } from 'openapi-types';

type Schema<TInput, TOutput> = StandardSchemaV1<TInput, TOutput>;
type AnySchema = Schema<any, any>;
type SchemaIssue = StandardSchemaV1.Issue;
type InferSchemaInput<T extends AnySchema> = T extends StandardSchemaV1<infer UInput, any> ? UInput : never;
type InferSchemaOutput<T extends AnySchema> = T extends StandardSchemaV1<any, infer UOutput> ? UOutput : never;
type TypeRest<TInput, TOutput> = [map: (input: TInput) => Promisable<TOutput>] | (IsEqual<TInput, TOutput> extends true ? [] : never);
/**
 * The schema for things can be trust without validation.
 * If the TInput and TOutput are different, you need pass a map function.
 *
 * @see {@link https://orpc.dev/docs/procedure#type-utility Type Utility Docs}
 */
declare function type<TInput, TOutput = TInput>(...[map]: TypeRest<TInput, TOutput>): Schema<TInput, TOutput>;

interface ValidationErrorOptions extends ErrorOptions {
    message: string;
    issues: readonly SchemaIssue[];
    /**
     * @todo require this field in v2
     */
    data?: unknown;
}
/**
 * This errors usually used for ORPCError.cause when the error is a validation error.
 *
 * @see {@link https://orpc.dev/docs/advanced/validation-errors Validation Errors Docs}
 */
declare class ValidationError extends Error {
    readonly issues: readonly SchemaIssue[];
    readonly data: unknown;
    constructor(options: ValidationErrorOptions);
}
interface ErrorMapItem<TDataSchema extends AnySchema> {
    status?: number;
    message?: string;
    data?: TDataSchema;
}
type ErrorMap = {
    [key in ORPCErrorCode]?: ErrorMapItem<AnySchema>;
};
type MergedErrorMap<T1 extends ErrorMap, T2 extends ErrorMap> = Omit<T1, keyof T2> & T2;
declare function mergeErrorMap<T1 extends ErrorMap, T2 extends ErrorMap>(errorMap1: T1, errorMap2: T2): MergedErrorMap<T1, T2>;
type ORPCErrorFromErrorMap<TErrorMap extends ErrorMap> = {
    [K in keyof TErrorMap]: K extends string ? TErrorMap[K] extends ErrorMapItem<infer TDataSchema extends Schema<unknown, unknown>> ? ORPCError<K, InferSchemaOutput<TDataSchema>> : never : never;
}[keyof TErrorMap];
type ErrorFromErrorMap<TErrorMap extends ErrorMap> = ORPCErrorFromErrorMap<TErrorMap> | ThrowableError;
declare function validateORPCError(map: ErrorMap, error: ORPCError<any, any>): Promise<ORPCError<string, unknown>>;

type Meta = Record<string, any>;
declare function mergeMeta<T extends Meta>(meta1: T, meta2: T): T;

type InputStructure = 'compact' | 'detailed';
type OutputStructure = 'compact' | 'detailed';
interface Route {
    /**
     * The HTTP method of the procedure.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     */
    method?: HTTPMethod;
    /**
     * The HTTP path of the procedure.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     */
    path?: HTTPPath;
    /**
     * The operation ID of the endpoint.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @default Concatenation of router segments
     */
    operationId?: string;
    /**
     * The summary of the procedure.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
     */
    summary?: string;
    /**
     * The description of the procedure.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
     */
    description?: string;
    /**
     * Marks the procedure as deprecated.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
     */
    deprecated?: boolean;
    /**
     * The tags of the procedure.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
     */
    tags?: readonly string[];
    /**
     * The status code of the response when the procedure is successful.
     * The status code must be in the 200-399 range.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     * @default 200
     */
    successStatus?: number;
    /**
     * The description of the response when the procedure is successful.
     *  This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
     * @default 'OK'
     */
    successDescription?: string;
    /**
     * Determines how the input should be structured based on `params`, `query`, `headers`, and `body`.
     *
     * @option 'compact'
     * Combines `params` and either `query` or `body` (depending on the HTTP method) into a single object.
     *
     * @option 'detailed'
     * Keeps each part of the request (`params`, `query`, `headers`, and `body`) as separate fields in the input object.
     *
     * Example:
     * ```ts
     * const input = {
     *   params: { id: 1 },
     *   query: { search: 'hello' },
     *   headers: { 'Content-Type': 'application/json' },
     *   body: { name: 'John' },
     * }
     * ```
     *
     * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
     * @default 'compact'
     */
    inputStructure?: InputStructure;
    /**
     * Determines how the response should be structured based on the output.
     *
     * @option 'compact'
     * The output data is directly returned as the response body.
     *
     * @option 'detailed'
     * Return an object with optional properties:
     * - `status`: The response status (must be in 200-399 range) if not set fallback to `successStatus`.
     * - `headers`: Custom headers to merge with the response headers (`Record<string, string | string[] | undefined>`)
     * - `body`: The response body.
     *
     * Example:
     * ```ts
     * const output = {
     *   status: 201,
     *   headers: { 'x-custom-header': 'value' },
     *   body: { message: 'Hello, world!' },
     * };
     * ```
     *
     * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
     * @default 'compact'
     */
    outputStructure?: OutputStructure;
    /**
     * Override entire auto-generated OpenAPI Operation Object Specification.
     *
     * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata Operation Metadata Docs}
     */
    spec?: OpenAPIV3_1.OperationObject | ((current: OpenAPIV3_1.OperationObject) => OpenAPIV3_1.OperationObject);
}
declare function mergeRoute(a: Route, b: Route): Route;
declare function prefixRoute(route: Route, prefix: HTTPPath): Route;
declare function unshiftTagRoute(route: Route, tags: readonly string[]): Route;
declare function mergePrefix(a: HTTPPath | undefined, b: HTTPPath): HTTPPath;
declare function mergeTags(a: readonly string[] | undefined, b: readonly string[]): readonly string[];
interface EnhanceRouteOptions {
    prefix?: HTTPPath;
    tags?: readonly string[];
}
declare function enhanceRoute(route: Route, options: EnhanceRouteOptions): Route;

interface ContractProcedureDef<TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap, TMeta extends Meta> {
    meta: TMeta;
    route: Route;
    inputSchema?: TInputSchema;
    outputSchema?: TOutputSchema;
    errorMap: TErrorMap;
}
/**
 * This class represents a contract procedure.
 *
 * @see {@link https://orpc.dev/docs/contract-first/define-contract#procedure-contract Contract Procedure Docs}
 */
declare class ContractProcedure<TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap, TMeta extends Meta> {
    /**
     * This property holds the defined options for the contract procedure.
     */
    '~orpc': ContractProcedureDef<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    constructor(def: ContractProcedureDef<TInputSchema, TOutputSchema, TErrorMap, TMeta>);
}
type AnyContractProcedure = ContractProcedure<any, any, any, any>;
declare function isContractProcedure(item: unknown): item is AnyContractProcedure;

/**
 * Represents a contract router, which defines a hierarchical structure of contract procedures.
 *
 * @info A contract procedure is a contract router too.
 * @see {@link https://orpc.dev/docs/contract-first/define-contract#contract-router Contract Router Docs}
 */
type ContractRouter<TMeta extends Meta> = ContractProcedure<any, any, any, TMeta> | {
    [k: string]: ContractRouter<TMeta>;
};
type AnyContractRouter = ContractRouter<any>;
/**
 * Infer all inputs of the contract router.
 *
 * @info A contract procedure is a contract router too.
 * @see {@link https://orpc.dev/docs/contract-first/define-contract#utilities Contract Utilities Docs}
 */
type InferContractRouterInputs<T extends AnyContractRouter> = T extends ContractProcedure<infer UInputSchema, any, any, any> ? InferSchemaInput<UInputSchema> : {
    [K in keyof T]: T[K] extends AnyContractRouter ? InferContractRouterInputs<T[K]> : never;
};
/**
 * Infer all outputs of the contract router.
 *
 * @info A contract procedure is a contract router too.
 * @see {@link https://orpc.dev/docs/contract-first/define-contract#utilities Contract Utilities Docs}
 */
type InferContractRouterOutputs<T extends AnyContractRouter> = T extends ContractProcedure<any, infer UOutputSchema, any, any> ? InferSchemaOutput<UOutputSchema> : {
    [K in keyof T]: T[K] extends AnyContractRouter ? InferContractRouterOutputs<T[K]> : never;
};
/**
 * Infer all errors of the contract router.
 *
 * @info A contract procedure is a contract router too.
 * @see {@link https://orpc.dev/docs/contract-first/define-contract#utilities Contract Utilities Docs}
 */
type InferContractRouterErrorMap<T extends AnyContractRouter> = T extends ContractProcedure<any, any, infer UErrorMap, any> ? UErrorMap : {
    [K in keyof T]: T[K] extends AnyContractRouter ? InferContractRouterErrorMap<T[K]> : never;
}[keyof T];
type InferContractRouterMeta<T extends AnyContractRouter> = T extends ContractRouter<infer UMeta> ? UMeta : never;

export { ContractProcedure as C, type as D, ValidationError as j, mergeErrorMap as m, mergeMeta as n, isContractProcedure as p, mergeRoute as q, prefixRoute as r, mergePrefix as s, mergeTags as t, unshiftTagRoute as u, validateORPCError as v, enhanceRoute as w };
export type { AnyContractRouter as A, InferContractRouterMeta as B, ErrorMap as E, InputStructure as I, MergedErrorMap as M, OutputStructure as O, Route as R, Schema as S, TypeRest as T, ValidationErrorOptions as V, EnhanceRouteOptions as a, AnySchema as b, Meta as c, ContractRouter as d, ContractProcedureDef as e, InferSchemaInput as f, InferSchemaOutput as g, ErrorFromErrorMap as h, SchemaIssue as i, ErrorMapItem as k, ORPCErrorFromErrorMap as l, AnyContractProcedure as o, InferContractRouterInputs as x, InferContractRouterOutputs as y, InferContractRouterErrorMap as z };
