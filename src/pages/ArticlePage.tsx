import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, techArticleSchema, breadcrumbSchema } from '../data/seoMeta';
import { articles, articleBySlug, articleAuthor, type ArticleBlock } from '../data/articles';
import { NotFoundPage } from './NotFoundPage';

// Same [text](href) convention as the Faq component: internal hrefs become
// router links, external ones plain anchors.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderText(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [, label, href] = match;
    nodes.push(
      href.startsWith('/') ? (
        <Link key={`${match.index}-${href}`} to={href} className="text-primary underline-offset-4 hover:underline transition-colors">
          {label}
        </Link>
      ) : (
        <a key={`${match.index}-${href}`} href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline transition-colors">
          {label}
        </a>
      ),
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes.length === 0 ? text : nodes;
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const Block: React.FC<{ block: ArticleBlock }> = ({ block }) => {
  switch (block.type) {
    case 'h2':
      return <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mt-14 mb-5">{block.text}</h2>;
    case 'h3':
      return <h3 className="font-headline text-xl font-bold tracking-tight mt-10 mb-4">{block.text}</h3>;
    case 'p':
      return <p className="text-on-surface-variant leading-relaxed mb-5">{renderText(block.text ?? '')}</p>;
    case 'callout':
      return (
        <div className="my-8 rounded-2xl border border-primary/25 bg-primary/5 p-6 flex gap-4">
          <span aria-hidden="true" className="material-symbols-outlined text-primary shrink-0 mt-0.5">lightbulb</span>
          <p className="text-on-surface-variant leading-relaxed">{renderText(block.text ?? '')}</p>
        </div>
      );
    case 'list': {
      const items = (block.items ?? []).map((item, i) => (
        <li key={i} className="text-on-surface-variant leading-relaxed">{renderText(item)}</li>
      ));
      return block.ordered ? (
        <ol className="list-decimal pl-6 mb-6 flex flex-col gap-3 marker:text-primary marker:font-bold">{items}</ol>
      ) : (
        <ul className="list-disc pl-6 mb-6 flex flex-col gap-3 marker:text-primary">{items}</ul>
      );
    }
    case 'code':
      return (
        <figure className="my-6">
          {block.label && (
            <figcaption className="text-[11px] font-label uppercase tracking-[0.18em] text-on-surface-variant/60 mb-2">{block.label}</figcaption>
          )}
          <pre className="rounded-xl border border-outline/60 bg-surface-container-lowest px-5 py-4 overflow-x-auto">
            <code className="text-sm text-on-surface font-mono">{block.code}</code>
          </pre>
        </figure>
      );
    case 'table':
      return (
        <div className="my-8 rounded-2xl border border-outline/50 bg-surface/60 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline/60">
                {(block.headers ?? []).map((h) => (
                  <th key={h} className="px-5 py-3.5 font-label uppercase tracking-wider text-on-surface-variant text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows ?? []).map((row, i) => (
                <tr key={i} className="border-b border-outline/30 last:border-0 align-top">
                  {row.map((cell, j) => (
                    <td key={j} className={`px-5 py-3.5 leading-relaxed ${j === 0 ? 'font-bold text-on-surface whitespace-nowrap' : 'text-on-surface-variant'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articleBySlug(slug) : undefined;
  if (!article) return <NotFoundPage />;
  const path = `/insights/${article.slug}`;

  return (
    <main className="pt-32 md:pt-40 pb-32 bg-background relative overflow-hidden">
      <SEO
        title={article.title}
        description={article.description}
        path={path}
        type="article"
        schema={[
          techArticleSchema({
            title: article.title,
            description: article.description,
            path,
            datePublished: article.datePublished,
            dateModified: article.dateModified,
            authorName: articleAuthor.name,
            authorLinkedIn: articleAuthor.linkedin,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: article.title, path },
          ]),
        ]}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.14]" style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgba(160,0,181,0.5), transparent 70%)' }} />

      <article className="max-w-[760px] mx-auto px-6 relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/insights" className="inline-flex items-center gap-1.5 text-[11px] font-label uppercase tracking-[0.22em] text-primary no-underline hover:gap-2.5 transition-all mb-8">
            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">arrow_back</span>
            Insights
          </Link>
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter mb-6 leading-[1.1]">{article.title}</h1>

          {/* Byline + dates, visible freshness/authorship signals */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-8 mb-10 border-b border-outline/50">
            <Link to="/about#team" className="flex items-center gap-3 no-underline group">
              <img
                src={`${import.meta.env.BASE_URL}team-alex.webp`}
                alt={articleAuthor.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border border-primary/30"
              />
              <span>
                <span className="block text-sm font-bold text-white group-hover:text-primary transition-colors">{articleAuthor.name}</span>
                <span className="block text-xs text-on-surface-variant">{articleAuthor.role}</span>
              </span>
            </Link>
            <span className="text-xs text-on-surface-variant/70 font-label tracking-wide">
              Published {formatDate(article.datePublished)}
              {article.dateModified !== article.datePublished && ` · Updated ${formatDate(article.dateModified)}`}
              {' · '}{article.readingMinutes} min read
            </span>
          </div>
        </motion.div>

        {/* Body */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="text-[17px]">
          {article.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </motion.div>

        {/* Scanner CTA */}
        <div className="mt-16 rounded-2xl border border-outline/60 bg-surface px-8 py-10 text-center relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(160,0,181,0.5), transparent 70%)' }} />
          <div className="relative">
            <h2 className="font-headline text-2xl font-bold tracking-tight mb-3">How does your domain score?</h2>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-7">Check your SPF, DKIM, DMARC, TLS and exposed services in about 15 seconds. Free, external, nothing to install.</p>
            <Link to="/security-check" className="no-underline inline-block">
              <motion.button
                className="btn-animated text-white font-headline font-bold px-9 py-4 rounded-lg text-base tracking-tight"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Run the free security check
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Other articles */}
        {articles.filter((a) => a.slug !== article.slug).length > 0 && (
          <div className="mt-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-5">More insights</p>
            {articles.filter((a) => a.slug !== article.slug).map((a) => (
              <Link key={a.slug} to={`/insights/${a.slug}`} className="block no-underline rounded-2xl border border-outline/50 bg-surface/60 p-6 hover:border-primary/40 transition-colors mb-4">
                <span className="block font-headline text-lg font-bold text-white mb-1">{a.title}</span>
                <span className="block text-sm text-on-surface-variant">{a.description}</span>
              </Link>
            ))}
          </div>
        )}
      </article>
    </main>
  );
};

export default ArticlePage;
