import { Promisable, AsyncIdQueueCloseOptions as AsyncIdQueueCloseOptions$1, SetSpanErrorOptions, AsyncIteratorClassCleanupFn, AsyncIteratorClass } from '@orpc/shared';
import { StandardRequest, EventMeta, StandardResponse, StandardBody, StandardHeaders } from '@orpc/standard-server';

type EncodedMessage = string | ArrayBufferLike | Uint8Array;
interface EncodedMessageSendFn {
    (message: EncodedMessage): Promisable<void>;
}

declare enum MessageType {
    REQUEST = 1,
    RESPONSE = 2,
    EVENT_ITERATOR = 3,
    ABORT_SIGNAL = 4
}
type EventIteratorEvent = 'message' | 'error' | 'done';
interface EventIteratorPayload {
    event: EventIteratorEvent;
    data: unknown;
    meta?: EventMeta;
}
interface RequestMessageMap {
    [MessageType.REQUEST]: Omit<StandardRequest, 'signal'>;
    [MessageType.EVENT_ITERATOR]: EventIteratorPayload;
    [MessageType.ABORT_SIGNAL]: void;
}
interface ResponseMessageMap {
    [MessageType.RESPONSE]: StandardResponse;
    [MessageType.EVENT_ITERATOR]: EventIteratorPayload;
    [MessageType.ABORT_SIGNAL]: void;
}
interface BaseMessageFormat<P = unknown> {
    /**
     * Client-guaranteed unique identifier
     */
    i: string;
    /**
     * @default REQUEST | RESPONSE
     */
    t?: MessageType;
    p: P;
}
interface SerializedEventIteratorPayload {
    e: EventIteratorEvent;
    d: unknown;
    m?: EventMeta;
}
interface SerializedRequestPayload {
    /**
     * The url of the request
     *
     * might be relative path if origin is `http://orpc`
     */
    u: string;
    b: StandardBody;
    /**
     * @default {}
     */
    h?: StandardHeaders;
    /**
     * @default POST
     */
    m?: string;
}
interface SerializedResponsePayload {
    /**
     * @default 200
     */
    s?: number;
    /**
     * @default {}
     */
    h?: StandardHeaders;
    b: StandardBody;
}
type DecodedMessageUnion<TMap extends RequestMessageMap | ResponseMessageMap> = {
    [K in keyof TMap]: [id: string, type: K, payload: TMap[K]];
}[keyof TMap];
type DecodedRequestMessage = DecodedMessageUnion<RequestMessageMap>;
type DecodedResponseMessage = DecodedMessageUnion<ResponseMessageMap>;
/**
 * New serialization functions without Blob handling
 */
declare function serializeRequestMessage<T extends keyof RequestMessageMap>(id: string, type: T, payload: RequestMessageMap[T]): BaseMessageFormat;
declare function deserializeRequestMessage(message: BaseMessageFormat): DecodedRequestMessage;
declare function serializeResponseMessage<T extends keyof ResponseMessageMap>(id: string, type: T, payload: ResponseMessageMap[T]): BaseMessageFormat;
declare function deserializeResponseMessage(message: BaseMessageFormat): DecodedResponseMessage;
/**
 * Original encode/decode functions now using the new serialize/deserialize functions
 */
declare function encodeRequestMessage<T extends keyof RequestMessageMap>(id: string, type: T, payload: RequestMessageMap[T]): Promise<EncodedMessage>;
declare function decodeRequestMessage(raw: EncodedMessage): Promise<DecodedRequestMessage>;
declare function encodeResponseMessage<T extends keyof ResponseMessageMap>(id: string, type: T, payload: ResponseMessageMap[T]): Promise<EncodedMessage>;
declare function decodeResponseMessage(raw: EncodedMessage): Promise<DecodedResponseMessage>;

interface experimental_RequestMessageSendFn {
    (message: DecodedRequestMessage): Promisable<void>;
}
interface ClientPeerCloseOptions extends AsyncIdQueueCloseOptions$1 {
    /**
     * Should abort or not?
     *
     * @default true
     */
    abort?: boolean;
}
declare class ClientPeer {
    private readonly peer;
    constructor(send: EncodedMessageSendFn);
    get length(): number;
    open(id: string): AbortController;
    request(request: StandardRequest): Promise<StandardResponse>;
    message(raw: EncodedMessage): Promise<void>;
    close(options?: AsyncIdQueueCloseOptions$1): void;
}
declare class experimental_ClientPeerWithoutCodec {
    private readonly idGenerator;
    /**
     * Queue of responses sent from server, awaiting consumption
     */
    private readonly responseQueue;
    /**
     * Queue of event iterator messages sent from server, awaiting consumption
     */
    private readonly serverEventIteratorQueue;
    /**
     * Controllers used to signal that the client should stop sending event iterator messages
     */
    private readonly serverControllers;
    /**
     * Cleanup functions invoked when the request/response is closed
     */
    private readonly cleanupFns;
    private readonly send;
    constructor(send: experimental_RequestMessageSendFn);
    get length(): number;
    open(id: string): AbortController;
    request(request: StandardRequest): Promise<StandardResponse>;
    message([id, type, payload]: DecodedResponseMessage): Promise<void>;
    close(options?: AsyncIdQueueCloseOptions$1): void;
}

interface AsyncIdQueueCloseOptions {
    id?: string;
    reason?: unknown;
}
declare class AsyncIdQueue<T> {
    private readonly openIds;
    private readonly queues;
    private readonly waiters;
    get length(): number;
    get waiterIds(): string[];
    hasBufferedItems(id: string): boolean;
    open(id: string): void;
    isOpen(id: string): boolean;
    push(id: string, item: T): void;
    pull(id: string): Promise<T>;
    close({ id, reason }?: AsyncIdQueueCloseOptions): void;
    assertOpen(id: string): void;
}

interface ToEventIteratorOptions extends SetSpanErrorOptions {
}
declare function toEventIterator(queue: AsyncIdQueue<EventIteratorPayload>, id: string, cleanup: AsyncIteratorClassCleanupFn, options?: ToEventIteratorOptions): AsyncIteratorClass<unknown>;
declare function resolveEventIterator(iterator: AsyncIterator<any>, callback: (payload: EventIteratorPayload) => Promise<'next' | 'abort'>): Promise<void>;

interface experimental_ResponseMessageSendFn {
    (message: DecodedResponseMessage): Promisable<void>;
}
interface ServerPeerHandleRequestFn {
    (request: StandardRequest): Promise<StandardResponse>;
}
interface ServerPeerCloseOptions extends AsyncIdQueueCloseOptions$1 {
    /**
     * Should abort or not?
     *
     * @default true
     */
    abort?: boolean;
}
declare class ServerPeer {
    private readonly peer;
    constructor(send: EncodedMessageSendFn);
    get length(): number;
    open(id: string): AbortController;
    /**
     * @todo This method will return Promise<void> in the next major version.
     */
    message(raw: EncodedMessage, handleRequest?: ServerPeerHandleRequestFn): Promise<[id: string, StandardRequest | undefined]>;
    /**
     * @deprecated Please pass the `handleRequest` (second arg) function to the `message` method instead.
     */
    response(id: string, response: StandardResponse): Promise<void>;
    close({ abort, ...options }?: ServerPeerCloseOptions): void;
}
declare class experimental_ServerPeerWithoutCodec {
    /**
     * Queue of event iterator messages sent from client, awaiting consumption
     */
    private readonly clientEventIteratorQueue;
    /**
     * Map of active client request controllers, should be synced to request signal
     */
    private readonly clientControllers;
    private readonly send;
    constructor(send: experimental_ResponseMessageSendFn);
    get length(): number;
    open(id: string): AbortController;
    /**
     * @todo This method will return Promise<void> in the next major version.
     */
    message([id, type, payload]: DecodedRequestMessage, handleRequest?: ServerPeerHandleRequestFn): Promise<[id: string, StandardRequest | undefined]>;
    /**
     * @deprecated Please pass the `handleRequest` (second arg) function to the `message` method instead.
     */
    response(id: string, response: StandardResponse): Promise<void>;
    close({ abort, ...options }?: ServerPeerCloseOptions): void;
}

export { ClientPeer, MessageType, ServerPeer, decodeRequestMessage, decodeResponseMessage, deserializeRequestMessage, deserializeResponseMessage, encodeRequestMessage, encodeResponseMessage, experimental_ClientPeerWithoutCodec, experimental_ServerPeerWithoutCodec, resolveEventIterator, serializeRequestMessage, serializeResponseMessage, toEventIterator };
export type { BaseMessageFormat, ClientPeerCloseOptions, DecodedMessageUnion, DecodedRequestMessage, DecodedResponseMessage, EncodedMessage, EncodedMessageSendFn, EventIteratorEvent, EventIteratorPayload, RequestMessageMap, ResponseMessageMap, SerializedEventIteratorPayload, SerializedRequestPayload, SerializedResponsePayload, ServerPeerCloseOptions, ServerPeerHandleRequestFn, ToEventIteratorOptions, experimental_RequestMessageSendFn, experimental_ResponseMessageSendFn };
