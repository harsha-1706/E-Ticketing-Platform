import React, { useState } from 'react';
import { User, signInWithPopup, googleProvider, auth, signOut } from '../firebase';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User | null;
  onOpenQuickSearch: () => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenQuickSearch,
  notificationCount,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      setProfileDropdownOpen(false);
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setProfileDropdownOpen(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin flex items-center justify-between gap-gutter">
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-space-xl">
          <button
            onClick={() => onSelectTab('search-tickets')}
            className="flex items-center gap-space-sm text-left focus:outline-none"
            id="logo-brand-btn"
          >
            <img
              alt="E-Ticket Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UgX4RghL6pOkX0FMRmTHGkrl6UtpV75n5_r3BmboemxSQRiQNimuG94lS3_E1IJBwVouvr1x1QEsjxGqOtug7tSPuAcEkFB6Y16xNaq6at_Q1EQL4a-530gTRz_Z6DGFusFZPEwKKkWEyB33BLpr4BQifKt95L1vclqxkE4JyB0H583VkVe4lyF3bNsl4YGKYXw3palLrOB428pXlv4R5dcucsZZfzzh9Wbw8JNqOSGiIoEFXx0cs_xpho"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              E-Ticket
            </span>
          </button>

          <nav className="hidden xl:flex items-center gap-space-xs">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-space-md py-space-sm font-label-lg text-label-lg transition-colors rounded-lg ${
                currentTab === 'home'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectTab('search-tickets')}
              className={`px-space-md py-space-sm font-label-lg text-label-lg transition-colors rounded-lg ${
                currentTab === 'search-tickets'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Search Tickets
            </button>
            <button
              onClick={() => onSelectTab('my-bookings')}
              className={`px-space-md py-space-sm font-label-lg text-label-lg transition-colors rounded-lg ${
                currentTab === 'my-bookings'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => onSelectTab('about-us')}
              className={`px-space-md py-space-sm font-label-lg text-label-lg transition-colors rounded-lg ${
                currentTab === 'about-us'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => onSelectTab('help-and-contact')}
              className={`px-space-md py-space-sm font-label-lg text-label-lg transition-colors rounded-lg ${
                currentTab === 'help-and-contact'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Help &amp; Contact
            </button>
          </nav>
        </div>

        {/* Right: Quick Search, Notifications, Admin Portal, User Profile */}
        <div className="flex items-center gap-space-md">
          {/* Quick Search Key Trigger */}
          <button
            onClick={onOpenQuickSearch}
            aria-label="Search tickets shortcut"
            className="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span className="font-label-md text-label-md text-text-muted">Search...</span>
            <kbd className="px-space-xs py-0.5 rounded bg-surface font-label-sm text-label-sm text-text-muted shadow-sm">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              aria-label="View notifications"
              onClick={() => onSelectTab('my-bookings')}
              className="p-space-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors relative flex items-center justify-center cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-danger text-on-error font-label-sm text-label-sm font-bold leading-none">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Admin Portal shortcut */}
          <button
            onClick={() => onSelectTab('my-bookings')}
            className="hidden md:inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span>Admin Portal</span>
          </button>

          {/* User Profile & Firebase Auth Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-space-sm pl-space-xs p-1 rounded-xl hover:bg-surface-container transition-colors focus:outline-none cursor-pointer"
              id="user-profile-menu-button"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-primary/20"
                src={
                  user?.photoURL ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-gflA0rGIuOzlHJQyoneC6KMDssraRqGyz4N2Soo2mYiCJBx-MTveu8mUY_bAUQ7BQJloWwnVYUk2xpdJ2mOaEu9F05SD7qXgfyAZLYAUZvy__p9leIGjUGkk_1xApnn4YzAltXqmiQ_nuIKHEeCzP3g1fGl68BkZk6zuGZm4_9rnt6GvZPR93D2Y-A3YLYSokmouKwM58kxbTTAL3IABs0U1fGDkVxBu6KbG6COtbYYx00SkG2x5g'
                }
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface">
                  {user?.displayName || 'John Doe'}
                </span>
                <span className="font-label-sm text-label-sm text-text-muted">
                  {user ? 'Google Authenticated' : 'Verified Passenger'}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-base hidden lg:block">
                arrow_drop_down
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface-container-lowest shadow-xl border border-border-subtle p-space-sm z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-space-sm border-b border-border-subtle mb-1">
                  <div className="flex items-center gap-2">
                    <img
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                      src={
                        user?.photoURL ||
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-gflA0rGIuOzlHJQyoneC6KMDssraRqGyz4N2Soo2mYiCJBx-MTveu8mUY_bAUQ7BQJloWwnVYUk2xpdJ2mOaEu9F05SD7qXgfyAZLYAUZvy__p9leIGjUGkk_1xApnn4YzAltXqmiQ_nuIKHEeCzP3g1fGl68BkZk6zuGZm4_9rnt6GvZPR93D2Y-A3YLYSokmouKwM58kxbTTAL3IABs0U1fGDkVxBu6KbG6COtbYYx00SkG2x5g'
                      }
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-on-surface font-bold truncate">
                        {user?.displayName || 'John Doe'}
                      </span>
                      <span className="font-body-sm text-text-muted truncate">
                        {user?.email || 'john.doe@university.edu'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-status-success font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                    <span>Firebase Auth &amp; Firestore Connected</span>
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-lg text-error hover:bg-error-container/30 font-label-md text-label-md flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Sign Out from Firebase</span>
                  </button>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="w-full text-left px-3 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">login</span>
                    <span>{authLoading ? 'Signing in...' : 'Sign In with Google'}</span>
                  </button>
                )}

                <div className="border-t border-border-subtle mt-1 pt-1">
                  <button
                    onClick={() => {
                      onSelectTab('my-bookings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container font-label-md text-label-md flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg text-primary">
                      confirmation_number
                    </span>
                    <span>My Bookings &amp; Tickets</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
