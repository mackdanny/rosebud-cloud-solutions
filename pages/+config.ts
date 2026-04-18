import type { Config } from 'vike/types';

export default {
  prerender: true,
  passToClient: ['urlPathname'],
  clientRouting: false,
  hydrationCanBeAborted: false,
} satisfies Config;
