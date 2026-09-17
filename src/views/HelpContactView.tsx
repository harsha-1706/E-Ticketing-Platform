import React, { useState } from 'react';

export const HelpContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [pnr, setPnr] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-margin py-space-xl flex flex-col gap-space-xl">
      <div className="rounded-3xl bg-surface-container-lowest p-space-xl border border-border-subtle shadow-sm flex flex-col gap-space-lg">
        <div>
          <span className="text-xs uppercase tracking-wider text-primary font-bold">
            Passenger Assistance &amp; Help Desk
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
            24x7 Transit Care &amp; Cancellation Support
          </h1>
          <p className="font-body-md text-body-md text-text-muted mt-2">
            Have questions regarding your bus terminal, luggage policy, or refund status? Reach out to
            our dedicated support line or submit a priority ticket.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-border-subtle flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <div>
              <span className="text-xs text-text-muted">Toll-Free Priority Line</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                1800-420-ETICK
              </h3>
              <p className="text-xs text-status-success font-medium">Average pickup under 45s</p>
            </div>
          </div>

          <div className="p-space-md rounded-2xl bg-surface-container-low border border-border-subtle flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <div>
              <span className="text-xs text-text-muted">Instant WhatsApp Dispatch</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                +91 98765 43210
              </h3>
              <p className="text-xs text-text-muted">Live Coach Tracking &amp; Delays</p>
            </div>
          </div>
        </div>

        {/* Support Inquiry Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md pt-space-md border-t border-border-subtle">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Submit a Booking Inquiry or Refund Request
          </h3>

          {submitted ? (
            <div className="p-space-md rounded-xl bg-status-success/15 text-on-surface border border-status-success/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-status-success text-2xl">check_circle</span>
              <div>
                <span className="font-bold block">Inquiry Ticket Dispatched!</span>
                <span className="text-xs text-text-muted">
                  Our duty officer will update your registered phone and email within 15 minutes.
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-muted font-bold">Booking PNR / Ticket Number</label>
                <input
                  type="text"
                  placeholder="e.g. ET-94827104"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-muted font-bold">Inquiry Type</label>
                <select className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-on-surface">
                  <option>Boarding Point Location Clarification</option>
                  <option>Refund &amp; Cancellation Status</option>
                  <option>Bus Delay &amp; Live Tracking</option>
                  <option>Conductor Contact Information</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs text-text-muted font-bold">Details</label>
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your inquiry or question..."
                  className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-on-surface"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-secondary transition-colors cursor-pointer"
                >
                  Submit Inquiry
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
