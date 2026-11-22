# NamelessAI Voice — Vercel deploy

This folder is a standalone Vercel deployment.

## 1. Environment variables
In Vercel → Project Settings → Environment Variables, add:
- `SUPABASE_URL`: `https://nzaelikbjumaidaombmp.supabase.co`
- `SUPABASE_ANON_KEY`: Supabase anon/public key (or publishable key, if supported by the Auth project)
- `GEMINI_API_KEY`: your Google AI Studio API key

Do not put the Gemini key in the browser.

## 2. Deploy
Import this GitHub repository into Vercel and set **Root Directory** to `vercel-deploy`, Framework Preset **Other**, then deploy. Add the environment variables and redeploy.

## 3. Supabase Auth URL settings
In Supabase → Authentication → URL Configuration, set Site URL to your deployed Vercel URL and add it to Redirect URLs. Also add localhost if testing locally.

## 4. Test
Open the Vercel site, create an account or sign in, send a text prompt, and try the microphone (Chrome supports Web Speech API).
