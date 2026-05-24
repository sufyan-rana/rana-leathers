export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="section-title">About RANA LEATHER'S</h1>
      <div className="section-underline"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Since 1985, RANA LEATHER'S has been at the forefront of leather craftsmanship. 
            Our master artisans combine traditional techniques with modern designs to create 
            pieces that stand the test of time.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Every product is crafted from premium, ethically sourced leather and undergoes 
            rigorous quality checks before reaching your hands.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We take pride in our heritage and continue to serve customers who appreciate 
            the beauty of handcrafted leather goods.
          </p>
        </div>
        <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">[Craftsmanship Image]</span>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-serif font-bold text-center text-[#2C1810] mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-lg">
            <div className="text-4xl mb-3">?</div>
            <h3 className="font-bold text-[#8B4513] mb-2">Quality First</h3>
            <p className="text-gray-600">Only the finest leathers and materials</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-4xl mb-3">??</div>
            <h3 className="font-bold text-[#8B4513] mb-2">Customer Trust</h3>
            <p className="text-gray-600">100% satisfaction guaranteed</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-4xl mb-3">??</div>
            <h3 className="font-bold text-[#8B4513] mb-2">Ethical Sourcing</h3>
            <p className="text-gray-600">Sustainable and responsible practices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
