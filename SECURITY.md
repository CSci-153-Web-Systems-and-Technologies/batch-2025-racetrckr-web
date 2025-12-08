# Security Guidelines - RaceTrckr

## 🚨 CRITICAL: API Key Rotation Required

**Your Supabase API keys were previously exposed in git history and have been removed. You MUST rotate them immediately.**

### Step 1: Rotate Supabase Keys (MANDATORY)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/rixbcjhblbrzynbgugpk/settings/api)
2. Navigate to **Settings → API**
3. Under **Project API keys**, click **Generate new anon key**
4. Copy the new key and update your `.env.local` file
5. The old key (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`) should now be considered compromised

### Step 2: Update Environment Variables

#### Local Development
Edit your `.env.local` file with the new keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://rixbcjhblbrzynbgugpk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_NEW_ANON_KEY_HERE>
```

#### Production/Staging Deployment
If you're deploying to hosting platforms, update the environment variables there:

**Vercel:**
1. Go to your project on [Vercel Dashboard](https://vercel.com)
2. Navigate to **Settings → Environment Variables**
3. Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your application

**Netlify:**
1. Go to **Site settings → Build & deploy → Environment**
2. Update the variables
3. Trigger a new deploy

**Other Platforms:**
Update environment variables in your platform's settings and redeploy.

### Step 3: Force Push Git History (REQUIRED)

The git history has been cleaned locally. You need to force push to update the remote repository:

```bash
# WARNING: This will rewrite the remote repository history
git push origin --force --all
git push origin --force --tags
```

⚠️ **If you have collaborators:**
- Notify them BEFORE force pushing
- They will need to re-clone the repository or reset their local branches after you force push

### Step 4: Clean Up Local Git References

```bash
# Remove backup references created by filter-branch
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Security Best Practices

### Environment Variables
- ✅ **DO:** Keep `.env.local` in `.gitignore`
- ✅ **DO:** Use `.env.example` for documentation
- ✅ **DO:** Store secrets in deployment platform's environment variables
- ❌ **DON'T:** Commit any `.env*` files except `.env.example`
- ❌ **DON'T:** Hardcode API keys in source code
- ❌ **DON'T:** Share API keys in chat, email, or screenshots

### Supabase Security
- Enable Row Level Security (RLS) on all tables
- Regularly review RLS policies
- Monitor Supabase logs for suspicious activity
- Consider using service role keys only in secure server environments
- Set up Supabase auth rate limiting

### Git Security
- Install `git-secrets` to prevent committing secrets: https://github.com/awslabs/git-secrets
- Use pre-commit hooks to scan for API keys
- Review changes before committing with `git diff`

## Monitoring & Response

### If Keys Are Compromised Again
1. Immediately rotate all keys in Supabase Dashboard
2. Review Supabase logs for unauthorized access
3. Check database for data tampering
4. Update all deployment environments
5. Notify users if data breach occurred (legal requirement in many jurisdictions)

### Supabase Security Features to Enable
- [ ] Enable email confirmation for new signups
- [ ] Set up CAPTCHA for auth endpoints
- [ ] Configure allowed email domains (if applicable)
- [ ] Enable MFA for Supabase dashboard access
- [ ] Set up database backups
- [ ] Configure IP restrictions (if needed)

## Questions?
- Supabase Security Docs: https://supabase.com/docs/guides/platform/security
- Report security issues: [Create a private security advisory on GitHub]

---

**Last Updated:** December 8, 2025  
**Status:** 🔴 Keys compromised - rotation required
