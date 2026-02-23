# Subdomain Setup: goodnewstoday.davidtphung.com

Connect your custom subdomain to the Vercel deployment at https://good-news-two.vercel.app/

---

## Step 1: Add Custom Domain in Vercel

1. Go to https://vercel.com/dashboard
2. Select the **good-news** project (or **good-news-two** — whichever shows your deployment)
3. Go to **Settings** → **Domains**
4. Enter `goodnewstoday.davidtphung.com` and click **Add**
5. Vercel will display the required DNS configuration — keep this page open

---

## Step 2: Add CNAME Record in GoDaddy

1. Log in to https://dcc.godaddy.com/ (GoDaddy Domain Control Center)
2. Find **davidtphung.com** and click **DNS** (or **Manage DNS**)
3. In the DNS Records section, click **Add New Record**
4. Fill in the following:

| Field | Value |
|-------|-------|
| **Type** | CNAME |
| **Name** | goodnewstoday |
| **Value** | cname.vercel-dns.com |
| **TTL** | 1 Hour (or 3600) |

5. Click **Save**

> **Important:** Enter only `goodnewstoday` in the Name field — GoDaddy automatically appends `.davidtphung.com`

### Alternative: A Record (if CNAME doesn't work)

If GoDaddy doesn't allow CNAME for this subdomain, use an A record instead:

| Field | Value |
|-------|-------|
| **Type** | A |
| **Name** | goodnewstoday |
| **Value** | 76.76.21.21 |
| **TTL** | 1 Hour |

---

## Step 3: Verify in Vercel

1. Wait **5-10 minutes** for GoDaddy DNS to propagate
2. Go back to Vercel → **Settings** → **Domains**
3. The domain should show a green checkmark: **Valid Configuration**
4. Vercel automatically provisions a free SSL certificate
5. Visit https://goodnewstoday.davidtphung.com to confirm it works

---

## Step-by-Step GoDaddy Screenshots Guide

### Finding DNS Settings
```
GoDaddy Dashboard
  → My Products
    → davidtphung.com
      → DNS (button next to domain)
        → DNS Records table
          → Add New Record (button)
```

### The Record You're Adding
```
Type:   CNAME
Name:   goodnewstoday
Value:  cname.vercel-dns.com
TTL:    1 Hour
```

---

## Troubleshooting

### Domain shows "Invalid Configuration" in Vercel
- Double-check the CNAME value is exactly `cname.vercel-dns.com` (no trailing dot in GoDaddy)
- Make sure you typed `goodnewstoday` (not `goodnewstoday.davidtphung.com`) in the Name field
- Wait up to 48 hours — GoDaddy DNS can be slow to propagate

### How to check if DNS has propagated
Run this in your terminal:
```bash
dig goodnewstoday.davidtphung.com CNAME
```
You should see `cname.vercel-dns.com` in the answer section.

Or check online at: https://dnschecker.org/#CNAME/goodnewstoday.davidtphung.com

### SSL certificate not working
- Vercel issues SSL automatically after DNS is verified
- Can take up to 24 hours after DNS verification
- If stuck, go to Vercel → Settings → Domains → click the refresh icon next to the domain

### Redirect www or root domain
If you also want `www.goodnewstoday.davidtphung.com` to work, add another CNAME:

| Type  | Name              | Value                | TTL    |
|-------|-------------------|----------------------|--------|
| CNAME | www.goodnewstoday | cname.vercel-dns.com | 1 Hour |

---

## Quick Checklist

- [ ] Added domain `goodnewstoday.davidtphung.com` in Vercel project settings
- [ ] Created CNAME record in GoDaddy pointing to `cname.vercel-dns.com`
- [ ] Waited for DNS propagation (5 min - 48 hours)
- [ ] Verified green checkmark in Vercel domains
- [ ] SSL certificate provisioned automatically
- [ ] Site loads at https://goodnewstoday.davidtphung.com
