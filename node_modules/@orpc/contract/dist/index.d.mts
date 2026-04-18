import { HTTPPath, HTTPMethod, ClientContext, Client } from '@orpc/client';
export { HTTPMethod, HTTPPath, ORPCError } from '@orpc/client';
import { E as ErrorMap, a as EnhanceRouteOptions, A as AnyContractRouter, C as ContractProcedure, M as MergedErrorMap, b as AnySchema, c as Meta, R as Route, d as ContractRouter, e as ContractProcedureDef, S as Schema, I as InputStructure, O as OutputStructure, f as InferSchemaInput, g as InferSchemaOutput, h as ErrorFromErrorMap, i as SchemaIssue } from './shared/contract.TuRtB1Ca.mjs';
export { o as AnyContractProcedure, k as ErrorMapItem, z as InferContractRouterErrorMap, x as InferContractRouterInputs, B as InferContractRouterMeta, y as InferContractRouterOutputs, l as ORPCErrorFromErrorMap, T as TypeRest, j as ValidationError, V as ValidationErrorOptions, w as enhanceRoute, p as isContractProcedure, m as mergeErrorMap, n as mergeMeta, s as mergePrefix, q as mergeRoute, t as mergeTags, r as prefixRoute, D as type, u as unshiftTagRoute, v as validateORPCError } from './shared/contract.TuRtB1Ca.mjs';
import { AsyncIteratorClass } from '@orpc/shared';
export { AsyncIteratorClass, Registry, ThrowableError } from '@orpc/shared';
export { OpenAPIV3_1 as OpenAPI } from 'openapi-types';
import '@standard-schema/spec';

declare function getContractRouter(router: AnyContractRouter, path: readonly string[]): AnyContractRouter | undefined;
type EnhancedContractRouter<T extends AnyContractRouter, TErrorMap extends ErrorMap> = T extends ContractProcedure<infer UInputSchema, infer UOutputSchema, infer UErrors, infer UMeta> ? ContractProcedure<UInputSchema, UOutputSchema, MergedErrorMap<TErrorMap, UErrors>, UMeta> : {
    [K in keyof T]: T[K] extends AnyContractRouter ? EnhancedContractRouter<T[K], TErrorMap> : never;
};
interface EnhanceContractRouterOptions<TErrorMap extends ErrorMap> extends EnhanceRouteOptions {
    errorMap: TErrorMap;
}
declare function enhanceContractRouter<T extends AnyContractRouter, TErrorMap extends ErrorMap>(router: T, options: EnhanceContractRouterOptions<TErrorMap>): EnhancedContractRouter<T, TErrorMap>;
/**
 * Minify a contract router into a smaller object.
 *
 * You should export the result to a JSON file. On the client side, you can import this JSON file and use it as a contract router.
 * This reduces the size of the contract and helps prevent leaking internal details of the router to the client.
 *
 * @see {@link https://orpc.dev/docs/contract-first/router-to-contract#minify-export-the-contract-router-for-the-client Router to Contract Docs}
 */
declare function minifyContractRouter(router: AnyContractRouter): AnyContractRouter;
type PopulatedContractRouterPaths<T extends AnyContractRouter> = T extends ContractProcedure<infer UInputSchema, infer UOutputSchema, infer UErrors, infer UMeta> ? ContractProcedure<UInputSchema, UOutputSchema, UErrors, UMeta> : {
    [K in keyof T]: T[K] extends AnyContractRouter ? PopulatedContractRouterPaths<T[K]> : never;
};
interface PopulateContractRouterPathsOptions {
    path?: readonly string[];
}
/**
 * Automatically populates missing route paths using the router's nested keys.
 *
 * Constructs paths by joining router keys with `/`.
 * Useful for NestJS integration that require explicit route paths.
 *
 * @see {@link https://orpc.dev/docs/openapi/integrations/implement-contract-in-nest#define-your-contract NestJS Implement Contract Docs}
 */
declare function populateContractRouterPaths<T extends AnyContractRouter>(router: T, options?: PopulateContractRouterPathsOptions): PopulatedContractRouterPaths<T>;

interface ContractProcedureBuilder<TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap, TMeta extends Meta> extends ContractProcedure<TInputSchema, TOutputSchema, TErrorMap, TMeta> {
    /**
     * Adds type-safe custom errors to the contract.
     * The provided errors are spared-merged with any existing errors in the contract.
     *
     * @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
     */
    errors<U extends ErrorMap>(errors: U): ContractProcedureBuilder<TInputSchema, TOutputSchema, MergedErrorMap<TErrorMap, U>, TMeta>;
    /**
     * Sets or updates the metadata for the contract.
     * The provided metadata is spared-merged with any existing metadata in the contract.
     *
     * @see {@link https://orpc.dev/docs/metadata Metadata Docs}
     */
    meta(meta: TMeta): ContractProcedureBuilder<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Sets or updates the route definition for the contract.
     * The provided route is spared-merged with any existing route in the contract.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
     */
    route(route: Route): ContractProcedureBuilder<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Defines the input validation schema for the contract.
     *
     * @see {@link https://orpc.dev/docs/procedure#input-output-validation Input Validation Docs}
     */
    input<U extends AnySchema>(schema: U): ContractProcedureBuilderWithInput<U, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Defines the output validation schema for the contract.
     *
     * @see {@link https://orpc.dev/docs/procedure#input-output-validation Output Validation Docs}
     */
    output<U extends AnySchema>(schema: U): ContractProcedureBuilderWithOutput<TInputSchema, U, TErrorMap, TMeta>;
}
interface ContractProcedureBuilderWithInput<TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap, TMeta extends Meta> extends ContractProcedure<TInputSchema, TOutputSchema, TErrorMap, TMeta> {
    /**
     * Adds type-safe custom errors to the contract.
     * The provided errors are spared-merged with any existing errors in the contract.
     *
     * @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
     */
    errors<U extends ErrorMap>(errors: U): ContractProcedureBuilderWithInput<TInputSchema, TOutputSchema, MergedErrorMap<TErrorMap, U>, TMeta>;
    /**
     * Sets or updates the metadata for the contract.
     * The provided metadata is spared-merged with any existing metadata in the contract.
     *
     * @see {@link https://orpc.dev/docs/metadata Metadata Docs}
     */
    meta(meta: TMeta): ContractProcedureBuilderWithInput<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Sets or updates the route definition for the contract.
     * The provided route is spared-merged with any existing route in the contract.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
     */
    route(route: Route): ContractProcedureBuilderWithInput<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Defines the output validation schema for the contract.
     *
     * @see {@link https://orpc.dev/docs/procedure#input-output-validation Output Validation Docs}
     */
    output<U extends AnySchema>(schema: U): ContractProcedureBuilderWithInputOutput<TInputSchema, U, TErrorMap, TMeta>;
}
interface ContractProcedureBuilderWithOutput<TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap, TMeta extends Meta> extends ContractProcedure<TInputSchema, TOutputSchema, TErrorMap, TMeta> {
    /**
     * Adds type-safe custom errors to the contract.
     * The provided errors are spared-merged with any existing errors in the contract.
     *
     * @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
     */
    errors<U extends ErrorMap>(errors: U): ContractProcedureBuilderWithOutput<TInputSchema, TOutputSchema, MergedErrorMap<TErrorMap, U>, TMeta>;
    /**
     * Sets or updates the metadata for the contract.
     * The provided metadata is spared-merged with any existing metadata in the contract.
     *
     * @see {@link https://orpc.dev/docs/metadata Metadata Docs}
     */
    meta(meta: TMeta): ContractProcedureBuilderWithOutput<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Sets or updates the route definition for the contract.
     * The provided route is spared-merged with any existing route in the contract.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
     */
    route(route: Route): ContractProcedureBuilderWithOutput<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Defines the input validation schema for the contract.
     *
     * @see {@link https://orpc.dev/docs/procedure#input-output-validation Input Validation Docs}
     */
    input<U extends AnySchema>(schema: U): ContractProcedureBuilderWithInputOutput<U, TOutputSchema, TErrorMap, TMeta>;
}
interface ContractProcedureBuilderWithInputOutput<TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap, TMeta extends Meta> extends ContractProcedure<TInputSchema, TOutputSchema, TErrorMap, TMeta> {
    /**
     * Adds type-safe custom errors to the contract.
     * The provided errors are spared-merged with any existing errors in the contract.
     *
     * @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
     */
    errors<U extends ErrorMap>(errors: U): ContractProcedureBuilderWithInputOutput<TInputSchema, TOutputSchema, MergedErrorMap<TErrorMap, U>, TMeta>;
    /**
     * Sets or updates the metadata for the contract.
     * The provided metadata is spared-merged with any existing metadata in the contract.
     *
     * @see {@link https://orpc.dev/docs/metadata Metadata Docs}
     */
    meta(meta: TMeta): ContractProcedureBuilderWithInputOutput<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Sets or updates the route definition for the contract.
     * The provided route is spared-merged with any existing route in the contract.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
     */
    route(route: Route): ContractProcedureBuilderWithInputOutput<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
}
interface ContractRouterBuilder<TErrorMap extends ErrorMap, TMeta extends Meta> {
    /**
     * This property holds the defined options for the contract router.
     */
    '~orpc': EnhanceContractRouterOptions<TErrorMap>;
    /**
     * Adds type-safe custom errors to the contract.
     * The provided errors are spared-merged with any existing errors in the contract.
     *
     * @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
     */
    'errors'<U extends ErrorMap>(errors: U): ContractRouterBuilder<MergedErrorMap<TErrorMap, U>, TMeta>;
    /**
     * Prefixes all procedures in the contract router.
     * The provided prefix is post-appended to any existing router prefix.
     *
     * @note This option does not affect procedures that do not define a path in their route definition.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing#route-prefixes OpenAPI Route Prefixes Docs}
     */
    'prefix'(prefix: HTTPPath): ContractRouterBuilder<TErrorMap, TMeta>;
    /**
     * Adds tags to all procedures in the contract router.
     * This helpful when you want to group procedures together in the OpenAPI specification.
     *
     * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
     */
    'tag'(...tags: string[]): ContractRouterBuilder<TErrorMap, TMeta>;
    /**
     * Applies all of the previously defined options to the specified contract router.
     *
     * @see {@link https://orpc.dev/docs/router#extending-router Extending Router Docs}
     */
    'router'<T extends ContractRouter<TMeta>>(router: T): EnhancedContractRouter<T, TErrorMap>;
}

interface ContractBuilderDef<TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap, TMeta extends Meta> extends ContractProcedureDef<TInputSchema, TOutputSchema, TErrorMap, TMeta>, EnhanceContractRouterOptions<TErrorMap> {
}
declare class ContractBuilder<TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap, TMeta extends Meta> extends ContractProcedure<TInputSchema, TOutputSchema, TErrorMap, TMeta> {
    /**
     * This property holds the defined options for the contract.
     */
    '~orpc': ContractBuilderDef<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    constructor(def: ContractBuilderDef<TInputSchema, TOutputSchema, TErrorMap, TMeta>);
    /**
     * Sets or overrides the initial meta.
     *
     * @see {@link https://orpc.dev/docs/metadata Metadata Docs}
     */
    $meta<U extends Meta>(initialMeta: U): ContractBuilder<TInputSchema, TOutputSchema, TErrorMap, U & Record<never, never>>;
    /**
     * Sets or overrides the initial route.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
     */
    $route(initialRoute: Route): ContractBuilder<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Sets or overrides the initial input schema.
     *
     * @see {@link https://orpc.dev/docs/procedure#initial-configuration Initial Procedure Configuration Docs}
     */
    $input<U extends AnySchema>(initialInputSchema?: U): ContractBuilder<U, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Adds type-safe custom errors to the contract.
     * The provided errors are spared-merged with any existing errors in the contract.
     *
     * @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
     */
    errors<U extends ErrorMap>(errors: U): ContractBuilder<TInputSchema, TOutputSchema, MergedErrorMap<TErrorMap, U>, TMeta>;
    /**
     * Sets or updates the metadata for the contract.
     * The provided metadata is spared-merged with any existing metadata in the contract.
     *
     * @see {@link https://orpc.dev/docs/metadata Metadata Docs}
     */
    meta(meta: TMeta): ContractProcedureBuilder<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Sets or updates the route definition for the contract.
     * The provided route is spared-merged with any existing route in the contract.
     * This option is typically relevant when integrating with OpenAPI.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
     * @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
     */
    route(route: Route): ContractProcedureBuilder<TInputSchema, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Defines the input validation schema for the contract.
     *
     * @see {@link https://orpc.dev/docs/procedure#input-output-validation Input Validation Docs}
     */
    input<U extends AnySchema>(schema: U): ContractProcedureBuilderWithInput<U, TOutputSchema, TErrorMap, TMeta>;
    /**
     * Defines the output validation schema for the contract.
     *
     * @see {@link https://orpc.dev/docs/procedure#input-output-validation Output Validation Docs}
     */
    output<U extends AnySchema>(schema: U): ContractProcedureBuilderWithOutput<TInputSchema, U, TErrorMap, TMeta>;
    /**
     * Prefixes all procedures in the contract router.
     * The provided prefix is post-appended to any existing router prefix.
     *
     * @note This option does not affect procedures that do not define a path in their route definition.
     *
     * @see {@link https://orpc.dev/docs/openapi/routing#route-prefixes OpenAPI Route Prefixes Docs}
     */
    prefix(prefix: HTTPPath): ContractRouterBuilder<TErrorMap, TMeta>;
    /**
     * Adds tags to all procedures in the contract router.
     * This helpful when you want to group procedures together in the OpenAPI specification.
     *
     * @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
     */
    tag(...tags: string[]): ContractRouterBuilder<TErrorMap, TMeta>;
    /**
     * Applies all of the previously defined options to the specified contract router.
     *
     * @see {@link https://orpc.dev/docs/router#extending-router Extending Router Docs}
     */
    router<T extends ContractRouter<TMeta>>(router: T): EnhancedContractRouter<T, TErrorMap>;
}
declare const oc: ContractBuilder<Schema<unknown, unknown>, Schema<unknown, unknown>, Record<never, never>, Record<never, never>>;

interface ContractConfig {
    defaultMethod: HTTPMethod;
    defaultSuccessStatus: number;
    defaultSuccessDescription: string;
    defaultInputStructure: InputStructure;
    defaultOutputStructure: OutputStructure;
}
declare function fallbackContractConfig<T extends keyof ContractConfig>(key: T, value: ContractConfig[T] | undefined): ContractConfig[T];

interface EventIteratorSchemaDetails {
    yields: AnySchema;
    returns?: AnySchema;
}
/**
 * Define schema for an event iterator.
 *
 * @see {@link https://orpc.dev/docs/event-iterator#validate-event-iterator Validate Event Iterator Docs}
 */
declare function eventIterator<TYieldIn, TYieldOut, TReturnIn = unknown, TReturnOut = unknown>(yields: Schema<TYieldIn, TYieldOut>, returns?: Schema<TReturnIn, TReturnOut>): Schema<AsyncIteratorObject<TYieldIn, TReturnIn, void>, AsyncIteratorClass<TYieldOut, TReturnOut, void>>;
declare function getEventIteratorSchemaDetails(schema: AnySchema | undefined): undefined | EventIteratorSchemaDetails;

/**
 * Help RPCLink automatically send requests using the specified HTTP method in the contract.
 *
 * @see {@link https://orpc.dev/docs/client/rpc-link#custom-request-method RPCLink Custom Request Method}
 */
declare function inferRPCMethodFromContractRouter(contract: AnyContractRouter): (options: unknown, path: readonly string[]) => Exclude<HTTPMethod, 'HEAD'>;

type ContractProcedureClient<TClientContext extends ClientContext, TInputSchema extends AnySchema, TOutputSchema extends AnySchema, TErrorMap extends ErrorMap> = Client<TClientContext, InferSchemaInput<TInputSchema>, InferSchemaOutput<TOutputSchema>, ErrorFromErrorMap<TErrorMap>>;

type ContractRouterClient<TRouter extends AnyContractRouter, TClientContext extends ClientContext = Record<never, never>> = TRouter extends ContractProcedure<infer UInputSchema, infer UOutputSchema, infer UErrorMap, any> ? ContractProcedureClient<TClientContext, UInputSchema, UOutputSchema, UErrorMap> : {
    [K in keyof TRouter]: TRouter[K] extends AnyContractRouter ? ContractRouterClient<TRouter[K], TClientContext> : never;
};

declare function isSchemaIssue(issue: unknown): issue is SchemaIssue;

export { AnyContractRouter, AnySchema, ContractBuilder, ContractProcedure, ContractProcedureDef, ContractRouter, EnhanceRouteOptions, ErrorFromErrorMap, ErrorMap, InferSchemaInput, InferSchemaOutput, InputStructure, MergedErrorMap, Meta, OutputStructure, Route, Schema, SchemaIssue, enhanceContractRouter, eventIterator, fallbackContractConfig, getContractRouter, getEventIteratorSchemaDetails, inferRPCMethodFromContractRouter, isSchemaIssue, minifyContractRouter, oc, populateContractRouterPaths };
export type { ContractBuilderDef, ContractConfig, ContractProcedureBuilder, ContractProcedureBuilderWithInput, ContractProcedureBuilderWithInputOutput, ContractProcedureBuilderWithOutput, ContractProcedureClient, ContractRouterBuilder, ContractRouterClient, EnhanceContractRouterOptions, EnhancedContractRouter, EventIteratorSchemaDetails, PopulateContractRouterPathsOptions, PopulatedContractRouterPaths };
