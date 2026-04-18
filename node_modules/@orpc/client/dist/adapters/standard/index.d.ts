export { C as CompositeStandardLinkPlugin, d as StandardLink, f as StandardLinkClient, S as StandardLinkClientInterceptorOptions, e as StandardLinkCodec, c as StandardLinkInterceptorOptions, b as StandardLinkOptions, a as StandardLinkPlugin } from '../../shared/client.2jUAqzYU.js';
export { S as STANDARD_RPC_JSON_SERIALIZER_BUILT_IN_TYPES, c as StandardRPCCustomJsonSerializer, b as StandardRPCJsonSerialized, a as StandardRPCJsonSerializedMetaItem, e as StandardRPCJsonSerializer, d as StandardRPCJsonSerializerOptions, g as StandardRPCLink, i as StandardRPCLinkCodec, h as StandardRPCLinkCodecOptions, f as StandardRPCLinkOptions, j as StandardRPCSerializer } from '../../shared/client.B3pNRBih.js';
import { StandardHeaders } from '@orpc/standard-server';
import { H as HTTPPath } from '../../shared/client.i2uoJbEp.js';
import '@orpc/shared';

declare function toHttpPath(path: readonly string[]): HTTPPath;
declare function toStandardHeaders(headers: Headers | StandardHeaders): StandardHeaders;
declare function getMalformedResponseErrorCode(status: number): string;

export { getMalformedResponseErrorCode, toHttpPath, toStandardHeaders };
