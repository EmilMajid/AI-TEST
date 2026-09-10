export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = (body.token || "").trim()
    const owner = (body.owner || "").trim()
    const repo = (body.repo || "").trim()

    if (!token) {
      return NextResponse.json({ success: false, error: "GitHub token tələb olunur" }, { status: 400 })
    }

    // 1. Verify User with GitHub API
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "testai-antigravity-bridge",
        Accept: "application/vnd.github+json",
      },
    })

    if (!userRes.ok) {
      const err = await userRes.json()
      return NextResponse.json({
        success: false,
        error: err.message || "GitHub token etibarsızdır və ya icazəsi yoxdur (401/403)",
      }, { status: 400 })
    }

    const userData = await userRes.json()

    // 2. If repo details are provided, verify repository push access
    let repoData: any = null
    let hasPushAccess = true

    if (owner && repo) {
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "testai-antigravity-bridge",
          Accept: "application/vnd.github+json",
        },
      })

      if (repoRes.ok) {
        repoData = await repoRes.json()
        hasPushAccess = repoData?.permissions?.push ?? true
      } else {
        return NextResponse.json({
          success: false,
          user: {
            login: userData.login,
            name: userData.name || userData.login,
            avatarUrl: userData.avatar_url,
          },
          error: `İstifadəçi (@${userData.login}) təsdiqləndi, lakin "${owner}/${repo}" repozitoriyası tapılmadı və ya giriş icazəsi yoxdur.`,
        }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        htmlUrl: userData.html_url,
        publicRepos: userData.public_repos,
      },
      repo: repoData ? {
        name: repoData.name,
        fullName: repoData.full_name,
        private: repoData.private,
        defaultBranch: repoData.default_branch,
        hasPushAccess,
      } : null,
      message: `GitHub hesabı (@${userData.login}) uğurla təsdiqləndi! ✅`,
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || "GitHub bağlantı xətası",
    }, { status: 500 })
  }
}
