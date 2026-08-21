function Categories() {
  const categories = [
    { icon: "🥛", name: "Dairy" },
    { icon: "🍚", name: "Rice" },
    { icon: "🥤", name: "Beverages" },
    { icon: "🍪", name: "Snacks" },
    { icon: "🧼", name: "Cleaning" },
    { icon: "🧴", name: "Personal Care" },
  ];

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg"
          >
            <div className="text-5xl">{category.icon}</div>
            <h3 className="font-bold mt-3">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;