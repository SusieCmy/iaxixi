import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--jp-cream) p-6">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <div className="mb-4 text-6xl">📝</div>
          <h1 className="font-(family-name:--font-jp) mb-4 font-bold text-(--jp-ink) text-4xl">
            文章未找到
          </h1>
          <p className="font-(family-name:--font-jp-sans) mb-8 text-(--jp-stone) text-lg">
            抱歉，您访问的文章不存在或已被删除。
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/blog"
            className="font-(family-name:--font-jp-sans) block w-full rounded-md bg-(--jp-vermilion) px-6 py-3 text-white transition-colors hover:opacity-90"
          >
            返回博客列表
          </Link>
          <Link
            href="/"
            className="font-(family-name:--font-jp-sans) block w-full rounded-md border border-(--jp-mist) bg-(--jp-cream) px-6 py-3 text-(--jp-ink) transition-colors hover:border-(--jp-stone) hover:bg-(--jp-paper)"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
