import { Interceptor } from '@orpc/shared';
import { StandardRequest, StandardLazyResponse } from '@orpc/standard-server';
import { b as ClientContext, c as ClientOptions, C as ClientLink } from './client.i2uoJbEp.mjs';

interface StandardLinkPlugin<T extends ClientContext> {
    order?: number;
    init?(options: StandardLinkOptions<T>): void;
}
declare class CompositeStandardLinkPlugin<T extends ClientContext, TPlugin extends StandardLinkPlugin<T>> implements StandardLinkPlugin<T> {
    protected readonly plugins: TPlugin[];
    constructor(plugins?: readonly TPlugin[]);
    init(options: StandardLinkOptions<T>): void;
}

interface StandardLinkCodec<T extends ClientContext> {
    encode(path: readonly string[], input: unknown, options: ClientOptions<T>): Promise<StandardRequest>;
    decode(response: StandardLazyResponse, options: ClientOptions<T>, path: readonly string[], input: unknown): Promise<unknown>;
}
interface StandardLinkClient<T extends ClientContext> {
    call(request: StandardRequest, options: ClientOptions<T>, path: readonly string[], input: unknown): Promise<StandardLazyResponse>;
}

interface StandardLinkInterceptorOptions<T extends ClientContext> extends ClientOptions<T> {
    path: readonly string[];
    input: unknown;
}
interface StandardLinkClientInterceptorOptions<T extends ClientContext> extends StandardLinkInterceptorOptions<T> {
    request: StandardRequest;
}
interface StandardLinkOptions<T extends ClientContext> {
    interceptors?: Interceptor<StandardLinkInterceptorOptions<T>, Promise<unknown>>[];
    clientInterceptors?: Interceptor<StandardLinkClientInterceptorOptions<T>, Promise<StandardLazyResponse>>[];
    plugins?: StandardLinkPlugin<T>[];
}
declare class StandardLink<T extends ClientContext> implements ClientLink<T> {
    readonly codec: StandardLinkCodec<T>;
    readonly sender: StandardLinkClient<T>;
    private readonly interceptors;
    private readonly clientInterceptors;
    constructor(codec: StandardLinkCodec<T>, sender: StandardLinkClient<T>, options?: StandardLinkOptions<T>);
    call(path: readonly string[], input: unknown, options: ClientOptions<T>): Promise<unknown>;
}

export { CompositeStandardLinkPlugin as C, StandardLink as d };
export type { StandardLinkClientInterceptorOptions as S, StandardLinkPlugin as a, StandardLinkOptions as b, StandardLinkInterceptorOptions as c, StandardLinkCodec as e, StandardLinkClient as f };
