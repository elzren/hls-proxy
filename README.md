# HLS Proxy
HLS proxy to bypass CORS errors when playing m3u8 files

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/elzren/hls-proxy.git
```

### 2. Install dependencies

```bash
cd hls-proxy
npm i
```

### 3. Start the server

```bash
npm run build
npm run start
```

 Now the server should be running on [http://localhost:8080](http://localhost:8080)

 ## Deploy

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Felzren%2Fhls-proxy)

## Usage

Use `/proxy` route to proxy m3u8 files:
```
http://localhost:8080/proxy?url=<m3u8_url>
```
