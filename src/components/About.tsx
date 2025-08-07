import React from 'react';
import { Target, Eye, Heart, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            About Icungo Ceramics Rwanda
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are pioneering Rwanda's ceramic industry by transforming our nation's abundant clay resources 
            into premium products that compete globally while strengthening our local economy.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To exploit Rwanda's rich clay deposits to produce world-class ceramic and porcelain products, 
              reducing imports while creating sustainable employment and driving economic growth.
            </p>
          </div>

          <div className="text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become East Africa's leading ceramic manufacturer, positioning Rwanda as a regional hub 
              for premium ceramic and porcelain products while fostering local talent and innovation.
            </p>
          </div>

          <div className="text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-gray-600 leading-relaxed">
              Quality craftsmanship, sustainable practices, community empowerment, and innovation drive 
              everything we do as we build Rwanda's ceramic industry from the ground up.
            </p>
          </div>
        </div>

        {/* Rwanda's Clay Resources */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg"
              alt="Raw clay materials and pottery making"
              className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-amber-600" />
              <h3 className="text-3xl font-bold text-gray-900">Rwanda's Clay Advantage</h3>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              Rwanda is blessed with some of the finest clay deposits in East Africa. Our strategic location 
              and abundant natural resources provide the perfect foundation for world-class ceramic production.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">High-Quality Clay Deposits</h4>
                  <p className="text-gray-600">Rich mineral composition ideal for premium ceramics and porcelain</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Strategic Location</h4>
                  <p className="text-gray-600">Central position in East Africa for regional market access</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Economic Impact</h4>
                  <p className="text-gray-600">Creating jobs, reducing imports, and boosting local manufacturing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;