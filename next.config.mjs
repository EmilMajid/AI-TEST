/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        './data/backup*/**/*',
        './data/backups/**/*',
        './data/*.bak*',
        './data/*.backup*',
        './data/*_HEAD*',
        './data/*_github*',
        './data/offline_tests*.bak*',
        './data/offline_tests_backup*',
        './data/vector_index/**/*',
        './data/poppler/**/*',
        './data/tessdata/**/*',
        './data/textbook-chunks*',
        './data/gen_*.json',
        './data/*chunks*/**/*',
        './data/g7_*',
        './data/*_questions.json',
        './data/*_TEST_BANKI*',
        './orig_offline_tests.json',
        './public/textbooks/**/*',
        './temp/**/*',
        './scripts/**/*',
        './autonomous_kag/**/*',
        './pilot_kag/**/*',
        './scratch/**/*',
      ],
      'api/[...slug]': [
        './data/grades/**/*',
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/**/*',
      ],
      '/api/[...slug]': [
        './data/grades/**/*',
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/**/*',
      ],
      'api/admin/[...slug]': [
        './data/grades/**/*',
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/**/*',
      ],
      '/api/admin/[...slug]': [
        './data/grades/**/*',
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/**/*',
      ],
      'api/auth/[...slug]': [
        './data/grades/**/*',
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/**/*',
      ],
      '/api/auth/[...slug]': [
        './data/grades/**/*',
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/**/*',
      ],
    },
  },
}

export default nextConfig
