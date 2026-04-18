import { b as ClientContext, c as ClientOptions, f as HTTPMethod } from './client.i2uoJbEp.js';
import { e as StandardLinkCodec, b as StandardLinkOptions, d as StandardLink, f as StandardLinkClient } from './client.2jUAqzYU.js';
import { Segment, Value, Promisable } from '@orpc/shared';
import { StandardHeaders, StandardRequest, StandardLazyResponse } from '@orpc/standard-server';

declare const STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES: {
    readonly BIGINT: 0;
    readonly DATE: 1;
    readonly NAN: 2;
    readonly UNDEFINED: 3;
    readonly URL: 4;
    readonly REGEXP: 5;
    readonly SET: 6;
    readonly MAP: 7;
};
type StandardRPCJsonSerializedMetaItem = readonly [type: number, ...path: Segment[]];
type StandardRPCJsonSerialized = [json: unknown, meta: StandardRPCJsonSerializedMetaItem[], maps: Segment[][], blobs: Blob[]];
interface StandardRPCCustomJsonSerializer {
    type: number;
    condition(data: unknown): boolean;
    serialize(data: any): unknown;
    deserialize(serialized: any): unknown;
}
interface StandardRPCJsonSerializerOptions {
    customJsonSerializers?: readonly StandardRPCCustomJsonSerializer[];
}
declare class StandardRPCJsonSerializer {
    private readonly customSerializers;
    constructor(options?: StandardRPCJsonSerializerOptions);
    serialize(data: unknown, segments?: Segment[], meta?: StandardRPCJsonSerializedMetaItem[], maps?: Segment[][], blobs?: Blob[]): StandardRPCJsonSerialized;
    deserialize(json: unknown, meta: readonly StandardRPCJsonSerializedMetaItem[]): unknown;
    deserialize(json: unknown, meta: readonly StandardRPCJsonSerializedMetaItem[], maps: readonly Segment[][], getBlob: (index: number) => Blob): unknown;
}

declare class StandardRPCSerializer {
    #private;
    private readonly jsonSerializer;
    constructor(jsonSerializer: StandardRPCJsonSerializer);
    serialize(data: unknown): object;
    deserialize(data: unknown): unknown;
}

interface StandardRPCLinkCodecOptions<T extends ClientContext> {
    /**
     * Base url for all requests.
     */
    url: Value<Promisable<string | URL>, [options: ClientOptions<T>, path: readonly string[], input: unknown]>;
    /**
     * The maximum length of the URL.
     *
     * @default 2083
     */
    maxUrlLength?: Value<Promisable<number>, [options: ClientOptions<T>, path: readonly string[], input: unknown]>;
    /**
     * The method used to make the request.
     *
     * @default 'POST'
     */
    method?: Value<Promisable<Exclude<HTTPMethod, 'HEAD'>>, [options: ClientOptions<T>, path: readonly string[], input: unknown]>;
    /**
     * The method to use when the payload cannot safely pass to the server with method return from method function.
     * GET is not allowed, it's very dangerous.
     *
     * @default 'POST'
     */
    fallbackMethod?: Exclude<HTTPMethod, 'HEAD' | 'GET'>;
    /**
     * Inject headers to the request.
     */
    headers?: Value<Promisable<StandardHeaders | Headers>, [options: ClientOptions<T>, path: readonly string[], input: unknown]>;
}
declare class StandardRPCLinkCodec<T extends ClientContext> implements StandardLinkCodec<T> {
    private readonly serializer;
    private readonly baseUrl;
    private readonly maxUrlLength;
    private readonly fallbackMethod;
    private readonly expectedMethod;
    private readonly headers;
    constructor(serializer: StandardRPCSerializer, options: StandardRPCLinkCodecOptions<T>);
    encode(path: readonly string[], input: unknown, options: ClientOptions<T>): Promise<StandardRequest>;
    decode(response: StandardLazyResponse): Promise<unknown>;
}

interface StandardRPCLinkOptions<T extends ClientContext> extends StandardLinkOptions<T>, StandardRPCLinkCodecOptions<T>, StandardRPCJsonSerializerOptions {
}
declare class StandardRPCLink<T extends ClientContext> extends StandardLink<T> {
    constructor(linkClient: StandardLinkClient<T>, options: StandardRPCLinkOptions<T>);
}

export { STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES as S, StandardRPCJsonSerializer as e, StandardRPCLink as g, StandardRPCLinkCodec as i, StandardRPCSerializer as j };
export type { StandardRPCJsonSerializedMetaItem as a, StandardRPCJsonSerialized as b, StandardRPCCustomJsonSerializer as c, StandardRPCJsonSerializerOptions as d, StandardRPCLinkOptions as f, StandardRPCLinkCodecOptions as h };
