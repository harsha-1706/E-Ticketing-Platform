import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-surface-container-low mt-space-2xl border-t border-border-subtle/50 no-print">
      <div className="max-w-7xl mx-auto px-margin py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter">
          {/* Brand & PCI info */}
          <div className="lg:col-span-2 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                E-Ticket Platform
              </span>
            </div>
            <p className="font-body-md text-body-md text-text-muted max-w-sm">
              High-frequency transit and multi-modal reservation infrastructure. Safe, rapid, and
              authenticated bookings for intercity buses, express rails, flights, and campus events.
            </p>
            <div className="flex items-center gap-space-sm text-status-success">
              <span className="material-symbols-outlined text-lg">verified_user</span>
              <span className="font-label-md text-label-md text-on-surface">
                PCI-DSS Level 1 Certified Secure Checkout
              </span>
            </div>
          </div>

          {/* Ticket Booking */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
              Ticket Booking
            </span>
            <button
              onClick={() => onSelectTab('search-tickets')}
              className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors text-left"
            >
              Bus Tickets
            </button>
            <button
              onClick={() => onSelectTab('search-tickets')}
              className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors text-left"
            >
              Train Tickets
            </button>
            <button
              onClick={() => onSelectTab('search-tickets')}
              className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors text-left"
            >
              Flight Tickets
            </button>
            <button
              onClick={() => onSelectTab('search-tickets')}
              className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors text-left"
            >
              Events &amp; Shows
            </button>
          </div>

          {/* Company & Trust */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
              Company &amp; Trust
            </span>
            <button
              onClick={() => onSelectTab('about-us')}
              className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors text-left"
            >
              About Us
            </button>
            <button
              onClick={() => onSelectTab('my-bookings')}
              className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors text-left"
            >
              Manage Reservations
            </button>
            <button
              onClick={() => onSelectTab('help-and-contact')}
              className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors text-left"
            >
              Help Center
            </button>
            <button
              onClick={() => onSelectTab('help-and-contact')}
              className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors text-left"
            >
              Cancellation Policy
            </button>
          </div>

          {/* Customer Helpline */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
              Customer Helpline
            </span>
            <div className="flex items-center gap-space-xs text-on-surface">
              <span className="material-symbols-outlined text-primary text-lg">call</span>
              <a
                href="tel:18004203842"
                className="font-headline-sm text-headline-sm hover:text-primary transition-colors"
              >
                1800-420-ETICK
              </a>
            </div>
            <div className="flex items-center gap-space-xs text-text-muted">
              <span className="material-symbols-outlined text-base">mail</span>
              <span className="font-body-sm text-body-sm">support@eticket.corp</span>
            </div>
            <div className="flex items-center gap-space-xs text-text-muted">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span className="font-body-sm text-body-sm">24x7 Priority Support</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & payment badges */}
        <div className="mt-space-xl pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md border-t border-border-subtle/40">
          <p className="font-body-sm text-body-sm text-text-muted">
            &copy; 2026 E-Ticket Platform Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-space-md">
            <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
              Accepted Payment Partners
            </span>
            <div className="flex items-center gap-space-xs">
              <span className="px-space-sm py-0.5 rounded bg-surface font-label-sm text-label-sm font-bold text-on-surface shadow-sm">
                VISA
              </span>
              <span className="px-space-sm py-0.5 rounded bg-surface font-label-sm text-label-sm font-bold text-on-surface shadow-sm">
                Mastercard
              </span>
              <span className="px-space-sm py-0.5 rounded bg-surface font-label-sm text-label-sm font-bold text-on-surface shadow-sm">
                UPI
              </span>
              <span className="px-space-sm py-0.5 rounded bg-surface font-label-sm text-label-sm font-bold text-on-surface shadow-sm">
                RuPay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
