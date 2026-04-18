import { PromiseWithError } from '@orpc/shared';

type HTTPPath = `/${string}`;
type HTTPMethod = 'HEAD' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type ClientContext = Record<PropertyKey, any>;
interface ClientOptions<T extends ClientContext> {
    signal?: AbortSignal;
    lastEventId?: string | undefined;
    context: T;
}
type FriendlyClientOptions<T extends ClientContext> = Omit<ClientOptions<T>, 'context'> & (Record<never, never> extends T ? {
    context?: T;
} : {
    context: T;
});
type ClientRest<TClientContext extends ClientContext, TInput> = Record<never, never> extends TClientContext ? undefined extends TInput ? [input?: TInput, options?: FriendlyClientOptions<TClientContext>] : [input: TInput, options?: FriendlyClientOptions<TClientContext>] : [input: TInput, options: FriendlyClientOptions<TClientContext>];
type ClientPromiseResult<TOutput, TError> = PromiseWithError<TOutput, TError>;
interface Client<TClientContext extends ClientContext, TInput, TOutput, TError> {
    (...rest: ClientRest<TClientContext, TInput>): ClientPromiseResult<TOutput, TError>;
}
type NestedClient<TClientContext extends ClientContext> = Client<TClientContext, any, any, any> | {
    [k: string]: NestedClient<TClientContext>;
};
type InferClientContext<T extends NestedClient<any>> = T extends NestedClient<infer U> ? U : never;
interface ClientLink<TClientContext extends ClientContext> {
    call: (path: readonly string[], input: unknown, options: ClientOptions<TClientContext>) => Promise<unknown>;
}
/**
 * Recursively infers the **input types** from a client.
 *
 * Produces a nested map where each endpoint's input type is preserved.
 */
type InferClientInputs<T extends NestedClient<any>> = T extends Client<any, infer U, any, any> ? U : {
    [K in keyof T]: T[K] extends NestedClient<any> ? InferClientInputs<T[K]> : never;
};
/**
 * Recursively infers the **body input types** from a client.
 *
 * If an endpoint's input includes `{ body: ... }`, only the `body` portion is extracted.
 * Produces a nested map of body input types.
 */
type InferClientBodyInputs<T extends NestedClient<any>> = T extends Client<any, infer U, any, any> ? U extends {
    body: infer UBody;
} ? UBody : U : {
    [K in keyof T]: T[K] extends NestedClient<any> ? InferClientBodyInputs<T[K]> : never;
};
/**
 * Recursively infers the **output types** from a client.
 *
 * Produces a nested map where each endpoint's output type is preserved.
 */
type InferClientOutputs<T extends NestedClient<any>> = T extends Client<any, any, infer U, any> ? U : {
    [K in keyof T]: T[K] extends NestedClient<any> ? InferClientOutputs<T[K]> : never;
};
/**
 * Recursively infers the **body output types** from a client.
 *
 * If an endpoint's output includes `{ body: ... }`, only the `body` portion is extracted.
 * Produces a nested map of body output types.
 */
type InferClientBodyOutputs<T extends NestedClient<any>> = T extends Client<any, any, infer U, any> ? U extends {
    body: infer UBody;
} ? UBody : U : {
    [K in keyof T]: T[K] extends NestedClient<any> ? InferClientBodyOutputs<T[K]> : never;
};
/**
 * Recursively infers the **error types** from a client when you use [type-safe errors](https://orpc.dev/docs/error-handling#type‐safe-error-handling).
 *
 * Produces a nested map where each endpoint's error type is preserved.
 */
type InferClientErrors<T extends NestedClient<any>> = T extends Client<any, any, any, infer U> ? U : {
    [K in keyof T]: T[K] extends NestedClient<any> ? InferClientErrors<T[K]> : never;
};
/**
 * Recursively infers a **union of all error types** from a client when you use [type-safe errors](https://orpc.dev/docs/error-handling#type‐safe-error-handling).
 *
 * Useful when you want to handle all possible errors from any endpoint at once.
 */
type InferClientErrorUnion<T extends NestedClient<any>> = T extends Client<any, any, any, infer U> ? U : {
    [K in keyof T]: T[K] extends NestedClient<any> ? InferClientErrorUnion<T[K]> : never;
}[keyof T];

export type { ClientLink as C, FriendlyClientOptions as F, HTTPPath as H, InferClientContext as I, NestedClient as N, ClientPromiseResult as a, ClientContext as b, ClientOptions as c, Client as d, ClientRest as e, HTTPMethod as f, InferClientInputs as g, InferClientBodyInputs as h, InferClientOutputs as i, InferClientBodyOutputs as j, InferClientErrors as k, InferClientErrorUnion as l };
