/*
 * @Date: 2025-07-25 15:58:20
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-29 10:48:56
 * @FilePath: \susie-cmy\src\components\StructuredData.tsx
 * @Description: 强者都是孤独的
 */
export default function StructuredData() {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'chenmuyu',
    url: 'https://www.iaxixi.com',
    image: 'https://www.iaxixi.com/cmy.jpg',
    description: 'chenmuyu，iaxixi.com网站创建者',
    knowsAbout: ['Web Development', 'Frontend Development', 'Next.js'],
    alumniOf: {
      '@type': 'Organization',
      name: '湖南 / 长沙',
    },
    sameAs: [
      'https://github.com/SusieCmy',
      // "https://linkedin.com/in/your-profile"
    ],
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'iaxixi - chenmuyu',
    url: 'https://www.iaxixi.com',
    author: {
      '@type': 'Person',
      name: 'chenmuyu',
    },
    description: 'chenmuyu的个人网站',
    inLanguage: 'zh-CN',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  )
}
