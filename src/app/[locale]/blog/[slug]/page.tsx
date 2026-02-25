/*
 * @Date: 2025-08-18
 * @Description: 博客文章详情页 - 日系简约风格
 */
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import MobileTOC from '@/components/blog/MobileTOC'
import ReadingProgress from '@/components/blog/ReadingProgress'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { getAllPosts, getPostBySlug } from '@/lib/blog'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: '文章未找到',
      description: '抱歉，您访问的文章不存在。',
    }
  }

  return {
    title: `${post.title} | chenmuyu的技术博客`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: 'chenmuyu', url: 'https://www.iaxixi.com' }],
    openGraph: {
      title: `${post.title} | chenmuyu的技术博客`,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['chenmuyu'],
      tags: post.tags,
      images: ['/cmy.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | chenmuyu的技术博客`,
      description: post.description,
      images: ['/cmy.jpg'],
    },
    alternates: {
      canonical: `https://www.iaxixi.com/blog/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // 结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: 'https://www.iaxixi.com/cmy.jpg',
    author: {
      '@type': 'Person',
      name: 'chenmuyu',
      url: 'https://www.iaxixi.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'chenmuyu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.iaxixi.com/cmy.jpg',
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.iaxixi.com/blog/${slug}`,
    },
    keywords: post.tags.join(', '),
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${post.readingTime}M`,
  }

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl bg-(--jp-cream)">
      <ReadingProgress />
      <MobileTOC />
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="mx-auto px-6 py-8">
        {/* 返回链接 */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="group inline-flex items-center font-(family-name:--font-jp-sans) text-(--jp-ash) text-sm transition-colors hover:text-(--jp-ink)"
          >
            <ArrowLeft className="group-hover:-translate-x-1 mr-1.5 h-4 w-4 transition-transform" />
            返回博客列表
          </Link>
        </nav>

        {/* 文章头部 */}
        <header className="mb-10 border-(--jp-mist) border-b pb-8">
          <h1 className="mb-3 font-(family-name:--font-jp) font-medium text-3xl text-(--jp-ink)">
            {post.title}
          </h1>
          <p className="mb-6 font-(family-name:--font-jp-sans) text-(--jp-stone) text-base leading-relaxed">
            {post.description}
          </p>

          {/* 文章元数据 */}
          <div className="mb-5 flex flex-wrap items-center gap-4 font-(family-name:--font-jp-sans) text-(--jp-ash) text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>约 {post.readingTime} 分钟阅读</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-(--jp-mist) bg-(--jp-paper) px-2.5 py-1 font-(family-name:--font-jp-sans) text-(--jp-stone) text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* 文章内容 */}
        <article className="prose prose-lg max-w-none prose-blockquote:border-(--jp-vermilion) prose-pre:bg-(--jp-paper) prose-headings:font-(family-name:--font-jp) prose-p:font-(family-name:--font-jp-sans) prose-blockquote:text-(--jp-stone) prose-code:text-(--jp-ink) prose-headings:text-(--jp-ink) prose-p:text-(--jp-stone) prose-strong:text-(--jp-ink)">
          <ReactMarkdown
            components={
              {
                code: ({ className, children, ref, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-md"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="rounded bg-(--jp-paper) px-1.5 py-0.5 text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
                h1: ({ children }) => (
                  <h1 className="mt-12 mb-6 border-(--jp-mist) border-b pb-4 font-medium text-2xl text-(--jp-ink)">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-10 mb-4 font-medium text-(--jp-ink) text-xl">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-8 mb-3 font-medium text-(--jp-ink) text-lg">{children}</h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-6 rounded-r-md border-(--jp-vermilion) border-l-2 bg-(--jp-paper) py-2 pl-4">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-(--jp-indigo) underline transition-colors hover:text-(--jp-vermilion)"
                  >
                    {children}
                  </a>
                ),
              } satisfies Components
            }
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
