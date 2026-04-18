import { Value, Promisable } from '@orpc/shared';
import { StandardRequest, StandardLazyResponse } from '@orpc/standard-server';
import { DecodedRequestMessage } from '@orpc/standard-server-peer';
import { b as ClientContext, c as ClientOptions } from '../../shared/client.i2uoJbEp.js';
import { f as StandardLinkClient } from '../../shared/client.2jUAqzYU.js';
import { f as StandardRPCLinkOptions, g as StandardRPCLink } from '../../shared/client.B3pNRBih.js';

/**
 * The message port used by electron in main process
 */
interface MessagePortMainLike {
    on: <T extends string>(event: T, callback: (event?: {
        data: any;
    }) => void) => void;
    postMessage: (data: any, transfer?: any[]) => void;
}
/**
 * The message port used by browser extension
 */
interface BrowserPortLike {
    onMessage: {
        addListener: (callback: (data: any) => void) => void;
    };
    onDisconnect: {
        addListener: (callback: () => void) => void;
    };
    postMessage: (data: any) => void;
}
type SupportedMessagePort = Pick<MessagePort, 'addEventListener' | 'postMessage'> | MessagePortMainLike | BrowserPortLike;
/**
 *  Message port can support [The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
 */
type SupportedMessagePortData = any;
declare function postMessagePortMessage(port: SupportedMessagePort, data: SupportedMessagePortData, transfer?: any[]): void;
declare function onMessagePortMessage(port: SupportedMessagePort, callback: (data: SupportedMessagePortData) => void): void;
declare function onMessagePortClose(port: SupportedMessagePort, callback: () => void): void;

interface LinkMessagePortClientOptions {
    port: SupportedMessagePort;
    /**
     * By default, oRPC serializes request/response messages to string/binary data before sending over message port.
     * If needed, you can define the this option to utilize full power of [MessagePort: postMessage() method](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/postMessage),
     * such as transferring ownership of objects to the other side or support unserializable objects like `OffscreenCanvas`.
     *
     * @remarks
     * - return null | undefined to disable this feature
     *
     * @warning Make sure your message port supports `transfer` before using this feature.
     * @example
     * ```ts
     * experimental_transfer: (message, port) => {
     *   const transfer = deepFindTransferableObjects(message) // implement your own logic
     *   return transfer.length ? transfer : null // only enable when needed
     * }
     * ```
     *
     * @see {@link https://orpc.dev/docs/adapters/message-port#transfer Message Port Transfer Docs}
     */
    experimental_transfer?: Value<Promisable<object[] | null | undefined>, [message: DecodedRequestMessage, port: SupportedMessagePort]>;
}
declare class LinkMessagePortClient<T extends ClientContext> implements StandardLinkClient<T> {
    private readonly peer;
    constructor(options: LinkMessagePortClientOptions);
    call(request: StandardRequest, _options: ClientOptions<T>, _path: readonly string[], _input: unknown): Promise<StandardLazyResponse>;
}

interface RPCLinkOptions<T extends ClientContext> extends Omit<StandardRPCLinkOptions<T>, 'url' | 'method' | 'fallbackMethod' | 'maxUrlLength'>, LinkMessagePortClientOptions {
}
/**
 * The RPC Link for common message port implementations.
 *
 * @see {@link https://orpc.dev/docs/client/rpc-link RPC Link Docs}
 * @see {@link https://orpc.dev/docs/adapters/message-port Message Port Adapter Docs}
 */
declare class RPCLink<T extends ClientContext> extends StandardRPCLink<T> {
    constructor(options: RPCLinkOptions<T>);
}

export { LinkMessagePortClient, RPCLink, onMessagePortClose, onMessagePortMessage, postMessagePortMessage };
export type { BrowserPortLike, LinkMessagePortClientOptions, MessagePortMainLike, RPCLinkOptions, SupportedMessagePort, SupportedMessagePortData };
