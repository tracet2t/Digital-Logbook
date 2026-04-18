import { ClientContext } from '@orpc/client';
import { StandardLinkPlugin, StandardLinkOptions } from '@orpc/client/standard';
import { A as AnyContractRouter } from '../shared/contract.TuRtB1Ca.js';
import '@orpc/shared';
import '@standard-schema/spec';
import 'openapi-types';

declare class RequestValidationPluginError extends Error {
}
/**
 * A link plugin that validates client requests against your contract schema,
 * ensuring that data sent to your server matches the expected types defined in your contract.
 *
 * @throws {ORPCError} with code `BAD_REQUEST` (same as server side) if input doesn't match the expected schema
 * @see {@link https://orpc.dev/docs/plugins/request-validation Request Validation Plugin Docs}
 */
declare class RequestValidationPlugin<T extends ClientContext> implements StandardLinkPlugin<T> {
    private readonly contract;
    constructor(contract: AnyContractRouter);
    init(options: StandardLinkOptions<T>): void;
}

/**
 * A link plugin that validates server responses against your contract schema,
 * ensuring that data returned from your server matches the expected types defined in your contract.
 *
 * - Throws `ValidationError` if output doesn't match the expected schema
 * - Converts mismatched defined errors to normal `ORPCError` instances
 *
 * @see {@link https://orpc.dev/docs/plugins/response-validation Response Validation Plugin Docs}
 */
declare class ResponseValidationPlugin<T extends ClientContext> implements StandardLinkPlugin<T> {
    private readonly contract;
    constructor(contract: AnyContractRouter);
    /**
     * run before (validate after) retry plugin, because validation failed can't be retried
     * run before (validate after) durable iterator plugin, because we expect durable iterator to validation (if user use it)
     */
    order: number;
    init(options: StandardLinkOptions<T>): void;
}

export { RequestValidationPlugin, RequestValidationPluginError, ResponseValidationPlugin };
