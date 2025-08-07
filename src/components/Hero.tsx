import React from 'react';
import { ArrowRight, Award, Users, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transforming Rwanda's 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Clay Heritage</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Icungo Ceramics harnesses Rwanda's rich clay deposits to create premium ceramic and porcelain products, 
                reducing imports while creating sustainable jobs and boosting our national economy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-300 hover:scale-105 flex items-center justify-center">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Product Categories</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Jobs Created</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Zap className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">30%</div>
                <div className="text-sm text-gray-600">Import Reduction</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg"
                alt="Ceramic pottery and craftsmanship"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">
                Utilizing Rwanda's finest clay deposits to create world-class ceramic products
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;