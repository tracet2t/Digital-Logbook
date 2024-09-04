import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  transform: {
    "\\.[jt]s$": ['babel-jest', { configFile: './babel.config.testing.js' }],
  },
};

export default config;
