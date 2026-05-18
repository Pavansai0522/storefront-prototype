import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import {
  STORE_ADDRESS_LINE1,
  STORE_ADDRESS_LINE2,
  STORE_HOURS,
  STORE_MAPS_URL,
  STORE_PHONE_DISPLAY,
  STORE_PHONE_TEL,
} from '../config/store';
export function VisitUs() {
  return (
    <section id="visit-us" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            VISIT OUR STORE
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Store Info */}
          <div className="space-y-8 bg-card p-8 md:p-12 rounded-2xl border border-border">
            <h3 className="text-2xl font-display font-bold text-gold mb-6">
              United Liquors
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Address</h4>
                  <p className="text-muted">
                    {STORE_ADDRESS_LINE1}
                    <br />
                    {STORE_ADDRESS_LINE2}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Hours</h4>
                  <ul className="text-muted space-y-1">
                    {STORE_HOURS.map((row) => (
                      <li key={row.label} className="flex justify-between gap-6 min-w-[14rem]">
                        <span>{row.label}</span>
                        <span>{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone</h4>
                  <a
                    href={STORE_PHONE_TEL}
                    className="text-muted hover:text-gold transition-colors">
                    
                    {STORE_PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <a
                    href="mailto:info@unitedliquors.com"
                    className="text-muted hover:text-gold transition-colors">
                    
                    info@unitedliquors.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map/Image Placeholder */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden border border-border group">
            <div className="absolute inset-0 bg-card/80 flex flex-col items-center justify-center z-10 p-6 text-center backdrop-blur-sm">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-6 shadow-lg shadow-gold/20">
                <MapPin className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">
                United Liquors
              </h3>
              <p className="text-muted mb-8 max-w-xs">
                Located in the heart of the city with ample parking available.
              </p>
              <a
                href={STORE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gold hover:bg-gold-hover text-background font-bold rounded transition-colors duration-300 min-h-[44px] inline-flex items-center justify-center">
                Get Directions
              </a>
            </div>
            {/* Background image for the map area */}
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Store location map"
              className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-700" />
            
          </div>
        </div>
      </div>
    </section>);

}