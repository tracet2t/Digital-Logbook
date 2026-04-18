import { stringifyJSON, parseEmptyableJSON, AsyncIteratorClass, isAsyncIteratorObject, isObject } from '@orpc/shared';

function toBatchAbortSignal(signals) {
  const realSignals = signals.filter((signal) => signal !== void 0);
  if (realSignals.length === 0 || realSignals.length !== signals.length) {
    return void 0;
  }
  const controller = new AbortController();
  const abortIfAllInputsAborted = () => {
    if (realSignals.every((signal) => signal.aborted)) {
      controller.abort();
    }
  };
  abortIfAllInputsAborted();
  for (const signal of realSignals) {
    signal.addEventListener("abort", () => {
      abortIfAllInputsAborted();
    }, {
      once: true,
      signal: controller.signal
    });
  }
  return controller.signal;
}

function toBatchRequest(options) {
  const url = new URL(options.url);
  let body;
  const batchRequestItems = options.requests.map((request) => ({
    body: request.body,
    headers: Object.keys(request.headers).length ? request.headers : void 0,
    method: request.method === options.method ? void 0 : request.method,
    url: request.url
  }));
  if (options.method === "GET") {
    url.searchParams.append("batch", stringifyJSON(batchRequestItems));
  } else if (options.method === "POST") {
    body = batchRequestItems;
  }
  return {
    method: options.method,
    url,
    headers: options.headers,
    body,
    signal: toBatchAbortSignal(options.requests.map((request) => request.signal))
  };
}
function parseBatchRequest(request) {
  const items = request.method === "GET" ? parseEmptyableJSON(request.url.searchParams.getAll("batch").at(-1)) : request.body;
  if (!Array.isArray(items)) {
    throw new TypeError("Invalid batch request");
  }
  return items.map((item) => {
    return {
      method: item.method ?? request.method,
      url: new URL(item.url),
      headers: item.headers ?? {},
      body: item.body,
      signal: request.signal
    };
  });
}

function toBatchResponse(options) {
  const mode = options.mode ?? "streaming";
  const minifyResponseItem = (item) => {
    return {
      index: item.index,
      status: item.status === options.status ? void 0 : item.status,
      headers: Object.keys(item.headers).length ? item.headers : void 0,
      body: item.body
    };
  };
  if (mode === "buffered") {
    return (async () => {
      try {
        const body = [];
        for await (const item of options.body) {
          body.push(minifyResponseItem(item));
        }
        return {
          headers: options.headers,
          status: options.status,
          body
        };
      } finally {
        await options.body.return?.();
      }
    })();
  }
  return {
    headers: options.headers,
    status: options.status,
    body: new AsyncIteratorClass(
      async () => {
        const { done, value } = await options.body.next();
        if (done) {
          return { done, value };
        }
        return {
          done,
          value: {
            index: value.index,
            status: value.status === options.status ? void 0 : value.status,
            headers: Object.keys(value.headers).length ? value.headers : void 0,
            body: value.body
          }
        };
      },
      async (reason) => {
        if (reason !== "next") {
          await options.body.return?.();
        }
      }
    )
  };
}
function parseBatchResponse(response) {
  const body = response.body;
  if (isAsyncIteratorObject(body) || Array.isArray(body)) {
    const iterator = (async function* () {
      for await (const item of body) {
        if (!isObject(item) || !("index" in item) || typeof item.index !== "number") {
          throw new TypeError("Invalid batch response", {
            cause: item
          });
        }
        yield {
          index: item.index,
          status: item.status ?? response.status,
          headers: item.headers ?? {},
          body: item.body
        };
      }
    })();
    return new AsyncIteratorClass(
      () => iterator.next(),
      async (reason) => {
        if (reason !== "next" && isAsyncIteratorObject(body)) {
          await body.return?.();
        }
      }
    );
  }
  throw new TypeError("Invalid batch response", {
    cause: response
  });
}

export { parseBatchRequest, parseBatchResponse, toBatchAbortSignal, toBatchRequest, toBatchResponse };
