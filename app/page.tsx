import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <Image
                  src="/logo.jpg"
                  alt="TESTAI.AZ Logo"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TESTAI.AZ</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Giriş
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90">
                  Qeydiyyat
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AI ilə Öyrən, Test Et, İnkişaf Et</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Azərbaycan dərslikləri əsasında hazırlanmış AI test platforması. Seçdiyiniz mövzuya uyğun testlər alın və
            bilik səviyyənizi yoxlayın.
          </p>
          <Link href="/register">
            <button className="text-lg px-8 py-3 bg-primary text-white rounded-md font-medium hover:opacity-90">
              İndi Başla
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="rounded-lg border bg-white text-center p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary rounded-md mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Rəsmi Dərsliklər</h3>
            <p className="text-gray-600 text-sm">e-derslik.edu.az portalından götürülmüş rəsmi dərs kitabları</p>
          </div>

          <div className="rounded-lg border bg-white text-center p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary rounded-md mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Test Yaradıcısı</h3>
            <p className="text-gray-600 text-sm">Süni intellekt vasitəsilə mövzuya uyğun test sualları</p>
          </div>

          <div className="rounded-lg border bg-white text-center p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary rounded-md mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Şəxsi Profil</h3>
            <p className="text-gray-600 text-sm">Məktəb, sinif və ərazi məlumatları ilə fərdi təcrübə</p>
          </div>

          <div className="rounded-lg border bg-white text-center p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary rounded-md mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nəticə Təhlili</h3>
            <p className="text-gray-600 text-sm">Cavablarınızın təfsilatlı təhlili və tövsiyələr</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Necə İşləyir?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Qeydiyyatdan Keç</h4>
              <p className="text-gray-600">Ad, soyad, məktəb və sinif məlumatlarını daxil et</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Mövzu Seç</h4>
              <p className="text-gray-600">Dərslik və öyrənmək istədiyiniz mövzunu seçin</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Test Et</h4>
              <p className="text-gray-600">AI tərəfindən yaradılan testləri həll edin və nəticəni görün</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 TESTAI.AZ. Bütün hüquqlar qorunur.</p>
        </div>
      </footer>
    </div>
  )
}
