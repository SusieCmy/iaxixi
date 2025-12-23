import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 p-6">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <div className="mb-4 text-6xl">📝</div>
          <h1 className="mb-4 font-bold text-4xl text-base-content">文章未找到</h1>
          <p className="mb-8 text-base-content/70 text-lg">抱歉，您访问的文章不存在或已被删除。</p>
        </div>

        <div className="space-y-4">
          <Link href="/blog" className="btn btn-primary btn-wide">
            返回博客列表
          </Link>
          <Link href="/" className="btn btn-outline btn-wide">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
