/** @type {import('next').NextConfig} */
const commonExcludes = [
  './data/backup*/**/*',
  './data/backups/**/*',
  './data/*.bak*',
  './data/*.backup*',
  './data/*_HEAD*',
  './data/*_github*',
  './data/offline_tests*.bak*',
  './data/offline_tests_backup*',
  './data/offline_tests.json',
  './data/grades/*.json',
  './data/grades/*.bak*',
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
  './public/audio/**/*',
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
    outputFileTracingIncludes: {
      '/*': ['./data/grades/*.json.gz', './data/question_bank.json'],
      '**/*': ['./data/grades/*.json.gz', './data/question_bank.json'],
      '/api/**/*': ['./data/grades/*.json.gz', './data/question_bank.json'],
      'api/**/*': ['./data/grades/*.json.gz', './data/question_bank.json'],
      '/api/generate-test': ['./data/grades/*.json.gz', './data/question_bank.json'],
      'api/generate-test': ['./data/grades/*.json.gz', './data/question_bank.json'],
      '/app/api/generate-test/route': ['./data/grades/*.json.gz', './data/question_bank.json'],
      'app/api/generate-test/route': ['./data/grades/*.json.gz', './data/question_bank.json'],
    },
    outputFileTracingExcludes: {
      '*': commonExcludes,
      '**/*': commonExcludes,
      '/api/admin/[...slug]': commonExcludes,
      'api/admin/[...slug]': commonExcludes,
      '/api/auth/[...slug]': commonExcludes,
      'api/auth/[...slug]': commonExcludes,
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
