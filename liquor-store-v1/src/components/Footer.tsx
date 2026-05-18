import React from 'react';
import { Zap, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  STORE_ADDRESS_LINE1,
  STORE_ADDRESS_LINE2,
  STORE_HOURS,
  STORE_PHONE_DISPLAY,
  STORE_PHONE_TEL,
} from '../config/store';
export function Footer() {
  return (
    <footer className="bg-footer pt-20 pb-8 border-t border-border mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-display font-bold tracking-wider">
              
              <Zap className="w-6 h-6 text-gold" fill="currentColor" />
              <span>
                UNITED <span className="text-gold">LIQUORS</span>
              </span>
            </Link>
            <p className="text-muted max-w-xs">
              Your Premier Spirits Destination. Curating the finest selection of
              beverages for our community since 2010.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors">
                
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors">
                
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-colors">
                
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:flex md:justify-center">
            <div>
              <h4 className="text-lg font-bold mb-6 text-foreground">
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className="text-muted hover:text-gold transition-colors">
                    
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    className="text-muted hover:text-gold transition-colors">
                    
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/spirits"
                    className="text-muted hover:text-gold transition-colors">
                    
                    Spirits
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wine"
                    className="text-muted hover:text-gold transition-colors">
                    
                    Wine
                  </Link>
                </li>
                <li>
                  <Link
                    to="/beer"
                    className="text-muted hover:text-gold transition-colors">
                    
                    Beer
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#visit-us"
                    className="text-muted hover:text-gold transition-colors">
                    
                    Visit Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-foreground">
              Contact Us
            </h4>
            <ul className="space-y-4 text-muted">
              <li>
                {STORE_ADDRESS_LINE1}
                <br />
                {STORE_ADDRESS_LINE2}
              </li>
              {STORE_HOURS.map((row) => (
                <li key={row.label}>
                  {row.label}: {row.time}
                </li>
              ))}
              <li>
                <a
                  href={STORE_PHONE_TEL}
                  className="hover:text-gold transition-colors">
                  
                  {STORE_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@unitedliquors.com"
                  className="hover:text-gold transition-colors">
                  
                  info@unitedliquors.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted/60">
          <p>© 2026 United Liquors. All Rights Reserved.</p>
          <p className="font-medium text-gold/60">
            Must be 21+ to purchase alcohol.
          </p>
        </div>
      </div>
    </footer>);

}