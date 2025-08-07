import React from 'react';
import { Cog, Users, Truck, ShieldCheck, Award, Wrench } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Cog className="h-8 w-8" />,
      title: 'Custom Manufacturing',
      description: 'Tailored ceramic production services to meet your specific requirements and specifications.',
      features: ['Custom designs', 'Bulk production', 'Quality assurance', 'Fast turnaround']
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Consultation Services',
      description: 'Expert guidance on ceramic applications, material selection, and product development.',
      features: ['Technical expertise', 'Material analysis', 'Design consultation', 'Process optimization']
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Distribution & Logistics',
      description: 'Comprehensive distribution network ensuring timely delivery across Rwanda and East Africa.',
      features: ['Regional coverage', 'Reliable shipping', 'Inventory management', 'Supply chain solutions']
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: 'Quality Control',
      description: 'Rigorous testing and quality assurance processes ensuring premium product standards.',
      features: ['Material testing', 'Quality certification', 'Standards compliance', 'Performance validation']
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Training & Development',
      description: 'Skills development programs for local artisans and ceramic industry professionals.',
      features: ['Technical training', 'Skill development', 'Certification programs', 'Career advancement']
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: 'Maintenance & Support',
      description: 'Ongoing support and maintenance services for ceramic installations and equipment.',
      features: ['Installation support', 'Maintenance services', '24/7 customer care', 'Technical assistance']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Beyond manufacturing, we provide comprehensive services to support Rwanda's ceramic industry 
            development and ensure customer success at every stage.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border border-gray-200 hover:shadow-xl hover:border-amber-200 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors duration-300">
                <div className="text-amber-600">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <div className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Economic Impact Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Driving Rwanda's Economic Growth
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our comprehensive approach goes beyond manufacturing to create lasting economic impact 
                through job creation, skills development, and import substitution.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-amber-600 mb-2">500+</div>
                  <div className="text-gray-700 font-medium">Direct Jobs Created</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 mb-2">30%</div>
                  <div className="text-gray-700 font-medium">Import Reduction Target</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 mb-2">15+</div>
                  <div className="text-gray-700 font-medium">Product Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 mb-2">100%</div>
                  <div className="text-gray-700 font-medium">Local Raw Materials</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1128726/pexels-photo-1128726.jpeg"
                alt="Ceramic manufacturing and job creation"
                className="rounded-xl shadow-lg w-full h-[300px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;