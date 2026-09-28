/** @type {import('next').NextConfig} */
const commonExcludes = [
  './data/**/*',
  './public/audio/**/*',
  './public/textbooks/**/*',
  './public/uploads/**/*',
  './scripts/**/*',
  './autonomous_kag/**/*',
  './pilot_kag/**/*',
  './scratch/**/*',
  './temp/**/*',
  './rag_storage/**/*',
  './reports/**/*',
]

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
      '*': commonExcludes,
      '**/*': commonExcludes,
      '/api/**/*': commonExcludes,
      'api/**/*': commonExcludes,
      '/api/admin/[...slug]': commonExcludes,
      'api/admin/[...slug]': commonExcludes,
      '/api/admin/[...slug]/route': commonExcludes,
      'api/admin/[...slug]/route': commonExcludes,
      '/api/[...slug]': commonExcludes,
      'api/[...slug]': commonExcludes,
      '/api/[...slug]/route': commonExcludes,
      'api/[...slug]/route': commonExcludes,
      '/api/auth/[...slug]': commonExcludes,
      'api/auth/[...slug]': commonExcludes,
      '/api/auth/[...slug]/route': commonExcludes,
      'api/auth/[...slug]/route': commonExcludes,
      '/api/generate-test': commonExcludes,
      'api/generate-test': commonExcludes,
      '/api/generate-test/route': commonExcludes,
      'api/generate-test/route': commonExcludes,
    },
  },
}

export default nextConfig
