import { StandardBody, StandardHeaders, StandardLazyRequest, StandardRequest, StandardResponse, StandardLazyResponse } from '@orpc/standard-server';
import { SetSpanErrorOptions, AsyncIteratorClass } from '@orpc/shared';

interface ToEventIteratorOptions extends SetSpanErrorOptions {
}
declare function toEventIterator(stream: ReadableStream<Uint8Array> | null, options?: ToEventIteratorOptions): AsyncIteratorClass<unknown>;
interface ToEventStreamOptions {
    /**
     * If true, a ping comment is sent periodically to keep the connection alive.
     *
     * @default true
     */
    eventIteratorKeepAliveEnabled?: boolean;
    /**
     * Interval (in milliseconds) between ping comments sent after the last event.
     *
     * @default 5000
     */
    eventIteratorKeepAliveInterval?: number;
    /**
     * The content of the ping comment. Must not include newline characters.
     *
     * @default ''
     */
    eventIteratorKeepAliveComment?: string;
    /**
     * If true, an initial comment is sent immediately upon stream start to flush headers.
     * This allows the receiving side to establish the connection without waiting for the first event.
     *
     * @default true
     */
    eventIteratorInitialCommentEnabled?: boolean;
    /**
     * The content of the initial comment sent upon stream start. Must not include newline characters.
     *
     * @default ''
     */
    eventIteratorInitialComment?: string;
}
declare function toEventStream(iterator: AsyncIterator<unknown | void, unknown | void, void>, options?: ToEventStreamOptions): ReadableStream<Uint8Array>;

interface ToStandardBodyOptions extends ToEventIteratorOptions {
}
declare function toStandardBody(re: Request | Response, options?: ToStandardBodyOptions): Promise<StandardBody>;
interface ToFetchBodyOptions extends ToEventStreamOptions {
}
/**
 * @param body
 * @param headers - The headers can be changed by the function and effects on the original headers.
 */
declare function toFetchBody(body: StandardBody, headers: Headers, options?: ToFetchBodyOptions): string | Blob | FormData | URLSearchParams | undefined | ReadableStream<Uint8Array>;

/**
 * @param headers
 * @param standardHeaders - The base headers can be changed by the function and effects on the original headers.
 */
declare function toStandardHeaders(headers: Headers, standardHeaders?: StandardHeaders): StandardHeaders;
/**
 * @param headers
 * @param fetchHeaders - The base headers can be changed by the function and effects on the original headers.
 */
declare function toFetchHeaders(headers: StandardHeaders, fetchHeaders?: Headers): Headers;

declare function toStandardLazyRequest(request: Request): StandardLazyRequest;
interface ToFetchRequestOptions extends ToFetchBodyOptions {
}
declare function toFetchRequest(request: StandardRequest, options?: ToFetchRequestOptions): Request;

interface ToFetchResponseOptions extends ToFetchBodyOptions {
}
declare function toFetchResponse(response: StandardResponse, options?: ToFetchResponseOptions): Response;
interface ToStandardLazyResponseOptions extends ToStandardBodyOptions {
}
declare function toStandardLazyResponse(response: Response, options?: ToStandardLazyResponseOptions): StandardLazyResponse;

export { toEventIterator, toEventStream, toFetchBody, toFetchHeaders, toFetchRequest, toFetchResponse, toStandardBody, toStandardHeaders, toStandardLazyRequest, toStandardLazyResponse };
export type { ToEventIteratorOptions, ToEventStreamOptions, ToFetchBodyOptions, ToFetchRequestOptions, ToFetchResponseOptions, ToStandardBodyOptions, ToStandardLazyResponseOptions };
