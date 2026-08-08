import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StorefrontSearchInput } from './StorefrontSearchInput';

const SEARCH_DEBOUNCE_MS = 300;

export function NavbarSearch(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setQuery(params.get('q') ?? '');
      return;
    }
    setQuery('');
  }, [location.pathname, location.search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmed = query.trim();
      const currentQuery =
        location.pathname === '/search'
          ? (new URLSearchParams(location.search).get('q')?.trim() ?? '')
          : '';

      if (trimmed === currentQuery) {
        return;
      }

      if (trimmed) {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`, {
          replace: location.pathname === '/search',
        });
        return;
      }

      if (location.pathname === '/search') {
        navigate('/search', { replace: true });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [query, navigate, location.pathname, location.search]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      if (location.pathname === '/search') {
        navigate('/search', { replace: true });
      }
      return;
    }
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={submitSearch} className="w-full" role="search">
      <label htmlFor="storefront-search" className="sr-only">
        Search products
      </label>
      <StorefrontSearchInput
        id="storefront-search"
        value={query}
        onChange={setQuery}
        placeholder="Search products…"
        ariaLabel="Search products"
        size="sm"
      />
    </form>
  );
}
