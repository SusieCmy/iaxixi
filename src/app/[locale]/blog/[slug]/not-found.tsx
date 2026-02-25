import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--jp-cream) p-6">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <div className="mb-4 text-6xl">📝</div>
          <h1 className="mb-4 font-(family-name:--font-jp) font-bold text-4xl text-(--jp-ink)">
            文章未找到
          </h1>
          <p className="mb-8 font-(family-name:--font-jp-sans) text-(--jp-stone) text-lg">
            抱歉，您访问的文章不存在或已被删除。
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/blog"
            className="block w-full rounded-md bg-(--jp-vermilion) px-6 py-3 font-(family-name:--font-jp-sans) text-white transition-colors hover:opacity-90"
          >
            返回博客列表
          </Link>
          <Link
            href="/"
            className="block w-full rounded-md border border-(--jp-mist) bg-(--jp-cream) px-6 py-3 font-(family-name:--font-jp-sans) text-(--jp-ink) transition-colors hover:border-(--jp-stone) hover:bg-(--jp-paper)"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
