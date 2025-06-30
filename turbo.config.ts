import { defineConfig } from 'turbo/config';

export default defineConfig({
  $schema: 'https://turborepo.com/schema.json',
  tasks: {
    build: {
      dependsOn: ['^build'],
      outputs: ['.next/**', '!.next/cache/**'],
    },
    'check-types': {
      dependsOn: ['^check-types'],
    },
    dev: {
      persistent: true,
      cache: false,
    },
  },
  pipeline: {
    build: {
      dependsOn: ['^build'],
      outputs: ['.next/**', 'dist/**'],
      env: [
        'IMAGEKIT_PUBLIC_KEY',
        'IMAGEKIT_PRIVATE_KEY',
        'IMAGEKIT_URL_ENDPOINT',
      ],
    },
  },
});
