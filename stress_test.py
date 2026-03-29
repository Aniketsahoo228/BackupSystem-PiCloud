import requests
import threading

URL = "http://10.52.86.9:8000/backup"

def upload():
    with open("testfile.enc", "rb") as f:
        files = {"files": f}
        data = {"pin": "1234", "device_id": "phoneA"}
        requests.post(URL, files=files, data=data)

threads = []

for i in range(10):  # simulate 10 users
    t = threading.Thread(target=upload)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print("Stress test completed")
