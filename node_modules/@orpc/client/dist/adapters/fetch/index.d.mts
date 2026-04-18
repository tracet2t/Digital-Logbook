import { Interceptor } from '@orpc/shared';
import { StandardRequest, StandardLazyResponse } from '@orpc/standard-server';
import { ToFetchRequestOptions } from '@orpc/standard-server-fetch';
import { b as ClientContext, c as ClientOptions } from '../../shared/client.i2uoJbEp.mjs';
import { a as StandardLinkPlugin, f as StandardLinkClient } from '../../shared/client.CpCa3si8.mjs';
import { f as StandardRPCLinkOptions, g as StandardRPCLink } from '../../shared/client.BFAVy68H.mjs';

interface LinkFetchPlugin<T extends ClientContext> extends StandardLinkPlugin<T> {
    initRuntimeAdapter?(options: LinkFetchClientOptions<T>): void;
}

interface LinkFetchInterceptorOptions<T extends ClientContext> extends ClientOptions<T> {
    request: Request;
    init: {
        redirect?: Request['redirect'];
    };
    path: readonly string[];
    input: unknown;
}
interface LinkFetchClientOptions<T extends ClientContext> extends ToFetchRequestOptions {
    fetch?: (request: Request, init: LinkFetchInterceptorOptions<T>['init'], options: ClientOptions<T>, path: readonly string[], input: unknown) => Promise<Response>;
    adapterInterceptors?: Interceptor<LinkFetchInterceptorOptions<T>, Promise<Response>>[];
    plugins?: LinkFetchPlugin<T>[];
}
declare class LinkFetchClient<T extends ClientContext> implements StandardLinkClient<T> {
    private readonly fetch;
    private readonly toFetchRequestOptions;
    private readonly adapterInterceptors;
    constructor(options: LinkFetchClientOptions<T>);
    call(standardRequest: StandardRequest, options: ClientOptions<T>, path: readonly string[], input: unknown): Promise<StandardLazyResponse>;
}

interface RPCLinkOptions<T extends ClientContext> extends LinkFetchClientOptions<T>, Omit<StandardRPCLinkOptions<T>, 'plugins'> {
}
/**
 * The RPC Link communicates with the server using the RPC protocol.
 *
 * @see {@link https://orpc.dev/docs/client/rpc-link RPC Link Docs}
 * @see {@link https://orpc.dev/docs/advanced/rpc-protocol RPC Protocol Docs}
 */
declare class RPCLink<T extends ClientContext> extends StandardRPCLink<T> {
    constructor(options: RPCLinkOptions<T>);
}

export { LinkFetchClient, RPCLink };
export type { LinkFetchClientOptions, LinkFetchInterceptorOptions, RPCLinkOptions };
