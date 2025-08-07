import React from 'react';
import { ArrowRight } from 'lucide-react';

const Products = () => {
  const productCategories = [
    {
      name: 'Floor Tiles',
      description: 'Premium ceramic floor tiles for residential and commercial spaces',
      image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
      features: ['Durable', 'Water Resistant', 'Various Designs']
    },
    {
      name: 'Ceramic Mugs',
      description: 'Handcrafted ceramic mugs perfect for daily use and gifting',
      image: 'https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg',
      features: ['Food Safe', 'Dishwasher Safe', 'Custom Designs']
    },
    {
      name: 'Dinnerware',
      description: 'Elegant ceramic plates, bowls, and serving dishes',
      image: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg',
      features: ['Premium Finish', 'Chip Resistant', 'Microwave Safe']
    },
    {
      name: 'Sanitary Wares',
      description: 'High-quality ceramic toilets, sinks, and bathroom fixtures',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      features: ['Water Efficient', 'Durable Design', 'Easy Maintenance']
    },
    {
      name: 'Decorative Ceramics',
      description: 'Artistic ceramic pieces for interior decoration',
      image: 'https://images.pexels.com/photos/1582183/pexels-photo-1582183.jpeg',
      features: ['Handcrafted', 'Unique Designs', 'Local Artistry']
    },
    {
      name: 'Industrial Ceramics',
      description: 'Specialized ceramic products for industrial applications',
      image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
      features: ['High Temperature', 'Chemical Resistant', 'Precision Made']
    }
  ];

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Product Range
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From functional everyday items to specialized industrial applications, 
            we create premium ceramic products that meet diverse market needs.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCategories.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                
                <div className="space-y-2 mb-6">
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Custom Ceramic Solutions
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Need something specific? We offer custom ceramic manufacturing services 
              tailored to your unique requirements.
            </p>
            <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;