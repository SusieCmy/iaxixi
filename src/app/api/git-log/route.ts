/*
 * @Date: 2026-02-26
 * @Description: 读取 git 提交记录 API
 */
import { execSync } from 'node:child_process'
import path from 'node:path'
import { NextResponse } from 'next/server'

export interface GitCommit {
  hash: string
  date: string
  subject: string
  body: string
}

export async function GET() {
  try {
    const repoPath = path.resolve(process.cwd())

    // 每个字段单独一行，用固定前缀区分，彻底避免 subject/body 内容干扰解析
    const raw = execSync(
      'git log --pretty=format:"COMMIT_START%nHASH:%H%nDATE:%ad%nSUBJ:%s%nBODY_START%n%b%nBODY_END" --date=format:"%Y-%m-%d" --no-merges',
      { cwd: repoPath, encoding: 'utf-8' }
    )

    const commits: GitCommit[] = raw
      .split('COMMIT_START')
      .filter(Boolean)
      .map((entry) => {
        const lines = entry.split('\n')
        const hash =
          lines
            .find((l) => l.startsWith('HASH:'))
            ?.slice(5)
            .trim() ?? ''
        const date =
          lines
            .find((l) => l.startsWith('DATE:'))
            ?.slice(5)
            .trim() ?? ''
        const subject =
          lines
            .find((l) => l.startsWith('SUBJ:'))
            ?.slice(5)
            .trim() ?? ''

        // 取 BODY_START 和 BODY_END 之间第一行有内容的文字
        const bodyStartIdx = lines.indexOf('BODY_START')
        const bodyEndIdx = lines.indexOf('BODY_END')
        const bodyLines =
          bodyStartIdx >= 0 && bodyEndIdx > bodyStartIdx
            ? lines.slice(bodyStartIdx + 1, bodyEndIdx)
            : []
        const body = bodyLines.find((l) => l.trim())?.trim() ?? ''

        return { hash, date, subject, body }
      })
      .filter((c) => c.hash && c.date)

    return NextResponse.json({ commits })
  } catch (error) {
    console.error('Git log error:', error)
    return NextResponse.json({ error: 'Failed to read git log' }, { status: 500 })
  }
}
