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
  async redirects() {
    return [
      {
        source: '/blog/suni-intellekt-muellimlerin-en-guclu-komekcisi-ferdil%C9%99sdirmis-tedris',
        destination: '/blog/suni-intellekt-muellimlerin-en-guclu-komekcisi-ferdilesdirilmis-tedris',
        permanent: true,
      },
      {
        source: '/:lang(az|en|tr|ru)/blog/suni-intellekt-muellimlerin-en-guclu-komekcisi-ferdil%C9%99sdirmis-tedris',
        destination: '/:lang/blog/suni-intellekt-muellimlerin-en-guclu-komekcisi-ferdilesdirilmis-tedris',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
