function getTamperedToken(token: string) {
    const [ header, payload, signature ] = token.split('.');

    const parsedPayload = JSON.parse(atob(payload));
    parsedPayload['role'] = 'admin';

    return `${header}.${btoa(JSON.stringify(parsedPayload))}.${signature}`;
}

function select(jsonObj: any, fields: string[]) {
    return fields.reduce((result, field) => {
      if (jsonObj.hasOwnProperty(field)) {
        (result as any)[field] = jsonObj[field];
      }
      return result;
    }, {});
}

function matchUrl(url: string, pattern: string): boolean {
    const regexPattern = new RegExp(`^${pattern.replace(/\*\*/g, '.*')}$`);
    return regexPattern.test(url);
}


function isUrlAllowed(url: string, blacklist: string[]): boolean {
  return blacklist.every(pattern => !matchUrl(url, pattern));
}

export { getTamperedToken, select, matchUrl, isUrlAllowed }