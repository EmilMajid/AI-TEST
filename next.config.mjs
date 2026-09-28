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
        './orig_offline_tests.json',
        './public/textbooks/**/*',
        './temp/**/*',
        './scripts/ocr_temp/**/*',
        './scripts/debug_images/**/*',
      ],
      '/api/admin/[...slug]': [
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/grades/**/*',
      ],
      '/api/auth/[...slug]': [
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/grades/**/*',
      ],
      '/api/[...slug]': [
        './data/offline_tests.json',
        './data/offline_tests*',
        './data/grades/**/*',
      ],
    },
  },
}

export default nextConfig
