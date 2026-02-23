# Subdomain Setup: goodnewstoday.davidtphung.com

Connect your custom subdomain to the Vercel deployment at https://good-news-two.vercel.app/

## Step 1: Add Custom Domain in Vercel

1. Go to https://vercel.com/dashboard
2. Select the **good-news** project
3. Go to **Settings** → **Domains**
4. Enter `goodnewstoday.davidtphung.com` and click **Add**
5. Vercel will show the required DNS record

## Step 2: Add DNS Record

In your DNS provider for `davidtphung.com`, add a **CNAME** record:

| Type  | Name          | Value                        | TTL  |
|-------|---------------|------------------------------|------|
| CNAME | goodnewstoday | cname.vercel-dns.com.        | 3600 |

If your DNS provider doesn't support CNAME for subdomains, use an **A** record:

| Type | Name          | Value         | TTL  |
|------|---------------|---------------|------|
| A    | goodnewstoday | 76.76.21.21   | 3600 |

## Step 3: Verify

1. Wait 5-10 minutes for DNS propagation
2. Go back to Vercel → Settings → Domains
3. The domain should show as **Valid Configuration**
4. Vercel automatically provisions an SSL certificate
5. Visit https://goodnewstoday.davidtphung.com to confirm

## Troubleshooting

- If the domain shows "Invalid Configuration", double-check the DNS record
- DNS propagation can take up to 48 hours in some cases
- Use `dig goodnewstoday.davidtphung.com` to verify the DNS record is live
- Vercel SSL certificates are issued automatically once DNS is verified
