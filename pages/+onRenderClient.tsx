import { hydrateRoot } from 'react-dom/client';
import type { OnRenderClientAsync } from 'vike/types';
import '../src/index.css';

export const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const Page = pageContext.Page as React.FC<{ urlPathname: string }>;
  const root = document.getElementById('root');
  if (!root) throw new Error('#root element not found');
  hydrateRoot(root, <Page urlPathname={pageContext.urlPathname} />);
};
