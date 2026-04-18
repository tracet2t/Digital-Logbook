import { AsyncIteratorClass, isTypescriptObject } from '@orpc/shared';
import { getEventMeta, withEventMeta } from '@orpc/standard-server';

function mapEventIterator(iterator, maps) {
  const mapError = async (error) => {
    let mappedError = await maps.error(error);
    if (mappedError !== error) {
      const meta = getEventMeta(error);
      if (meta && isTypescriptObject(mappedError)) {
        mappedError = withEventMeta(mappedError, meta);
      }
    }
    return mappedError;
  };
  return new AsyncIteratorClass(async () => {
    const { done, value } = await (async () => {
      try {
        return await iterator.next();
      } catch (error) {
        throw await mapError(error);
      }
    })();
    let mappedValue = await maps.value(value, done);
    if (mappedValue !== value) {
      const meta = getEventMeta(value);
      if (meta && isTypescriptObject(mappedValue)) {
        mappedValue = withEventMeta(mappedValue, meta);
      }
    }
    return { done, value: mappedValue };
  }, async () => {
    try {
      await iterator.return?.();
    } catch (error) {
      throw await mapError(error);
    }
  });
}

export { mapEventIterator as m };
