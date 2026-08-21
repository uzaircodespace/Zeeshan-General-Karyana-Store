function Hero() {
  return (
    <section className="bg-green-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Welcome to Zeeshan General & Karyana Store
        </h1>

        <p className="text-xl mb-8">
          Your one-stop shop for groceries, beverages, snacks, and daily essentials.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Shop Now
          </button>

          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-green-700">
            View Products
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;