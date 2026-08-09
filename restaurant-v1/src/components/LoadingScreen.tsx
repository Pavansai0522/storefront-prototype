import { Spinner } from './Spinner';

export function LoadingScreen(): JSX.Element {
  return (
    <div className="loading-screen">
      <Spinner size="lg" />
    </div>
  );
}
