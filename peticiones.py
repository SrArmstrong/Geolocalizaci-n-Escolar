import asyncio
import aiohttp
import time

TARGET_URL = 'https://geolocalizaci-n-escolar.vercel.app/map'  # Cambia esto
MAX_CONCURRENT = 250  # Número de peticiones simultáneas
TIMEOUT_THRESHOLD = 2.0  # segundos

async def fetch(session, url):
    start = time.perf_counter()
    try:
        async with session.get(url, timeout=TIMEOUT_THRESHOLD + 2) as response:
            await response.text()
            duration = time.perf_counter() - start
            return duration
    except Exception:
        return TIMEOUT_THRESHOLD + 10  # Consideramos como "lenta"

async def run_test():
    slow_count = 0
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, TARGET_URL) for _ in range(MAX_CONCURRENT)]
        results = await asyncio.gather(*tasks)

        for i, duration in enumerate(results):
            status = "✅" if duration <= TIMEOUT_THRESHOLD else "⏱️"
            print(f"Petición {i+1}: {duration:.2f}s {status}")
            if duration > TIMEOUT_THRESHOLD:
                slow_count += 1

    print(f"\n🔍 De {MAX_CONCURRENT} peticiones, {slow_count} tardaron más de {TIMEOUT_THRESHOLD} segundos.")

if __name__ == "__main__":
    asyncio.run(run_test())
