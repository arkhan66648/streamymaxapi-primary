addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const target = url.searchParams.get('url')

  if (!target) {
    return new Response('Missing "url" parameter', { status: 400 })
  }

  const targetUrl = new URL(target)
  const originUrl = new URL(request.url).origin

  const headers = {
    'Origin': 'https://go4score.lc',
    'Referer': 'https://go4score.lc/',
    'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Sec-Fetch-Dest': 'iframe',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Ch-Ua': '"Not/A)Brand";v="99", "Google Chrome";v="125", "Chromium";v="125"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Dnt': '1',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
  }

  const clientCookie = request.headers.get('Cookie')
  if (clientCookie) {
    headers['Cookie'] = clientCookie
  }

  const resp = await fetch(target, { headers })

  const h = new Headers(resp.headers)
  h.set('Access-Control-Allow-Origin', '*')
  h.set('Access-Control-Allow-Credentials', 'true')
  h.set('X-Frame-Options', 'ALLOWALL')

  const setCookie = resp.headers.get('Set-Cookie')
  if (setCookie) {
    h.set('Set-Cookie', setCookie)
  }

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: h,
  })
}
